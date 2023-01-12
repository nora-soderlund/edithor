import EdithorRuleStates from "./EdithorRuleStates"

export default interface EdithorRule {    
    conditions: EdithorRuleStates,

    process(input: string): string
};
