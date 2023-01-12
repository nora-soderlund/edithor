import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleStates from "../../Types/EdithorRuleStates";

type EmitLineCommentsOptions = {
    regex: RegExp
};

export default class EmitLineComments implements EdithorRule {
    options: EmitLineCommentsOptions;
    
    constructor(options?: EmitLineCommentsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleStates = {
        codeBlock: false,
        beforeHtmlEntities: true
    };

    process(input: string): string {
        return input.replaceAll(this.options.regex ?? /\<!--(.*?)-->/gs, '');
    };
};

