var request = require('request');

var findRuneContainer = (container) => {
    return new RegExp(`(?<=${container} Rune)(.*?)(?=Reported)`);
};

var findRuneTitle = (second = false) => {
    if (!second) return new RegExp("(?<=alt=')(.*?)(?=')");
    return new RegExp("(?<=alt=')(.*?)(?=')", "g");
};

var _lookup = () => {

    return {

        getRunescapeCommands: () => {
            return ['vis'];
        },

        processRunescapeMessage: (author, commandLine, command, split, discordQueue, runescapeQueue) => {
            request('https://warbandtracker.com/goldberg/', (err, response, body) => {
                if (err) {
                    runescapeQueue.push([`Error looking up vis wax combination.`, undefined, new Date()]);
                    return;
                }
                body = body.replace(/\n/g, '');
                body = body.replace(/\t/g, '');
                var found = body.match(findRuneContainer('First'));

                if (!found) {
                    console.log('Error parsing body.');
                    return;
                }
                found = found[0].match(findRuneTitle());
                if (!found) {
                    console.log('Error parsing title.');
                    return;
                }
                var first = found[0];
                found = body.match(/(?<=Second Rune)(.*?)(?=div)/);
                if (!found) {
                    console.error('Error parsing second runes');
                    return;
                }
                found = found[0].match(findRuneTitle(true));
                if (!found) {
                    console.error('Error parsing second runes titles');
                    return;
                }
                runescapeQueue.push([`Vis Wax Combonations: First Rune: ${first}. Possible Second Runes: ${found.join(', ')}`, undefined, new Date()])
            });

        }
    };
};
module.exports = _lookup;