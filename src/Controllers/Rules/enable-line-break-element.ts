import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleStates from "../../Types/EdithorRuleStates";

export default class EnableLineBreakElements implements EdithorRule {
    conditions: EdithorRuleStates = {
        codeBlock: false
    };

    process(input: string): string {
        const carriageReturn = `&#${'\r'.charCodeAt(0)};`;
        const lineFeed = `&#${'\n'.charCodeAt(0)};`;
        
        return input.replaceAll(carriageReturn + lineFeed, lineFeed).replaceAll(lineFeed, '<br/>');
    };
};

