import React, { Component, ReactNode } from "react";
import Editor from "./Components/Editor";
import Renderer from "./Components/Renderer";
import EdithorRule from "./Types/EdithorRule";
import Rules from "./Controllers/Rules";

import "./polyfill.js";

type EdithorProps = {
    input: string,
    children: React.ReactNode[],

    debug?: "info" | "all" | boolean,
    rules?: {[key: string]: boolean | object}
};

type EdithorComponentState = {
    // this is the only object that the children have access to
    edithor: EdithorState,

    // these are states that our child components have no use of knowing about
    // e.g. they should not rely on any rules of any kind
    rules: EdithorRule[]
};

// the state we're refering to is not the React component state, this Edithor component should not
// have any states since it's more of a placeholder, think of it as a React Fragment 
export type EdithorState = {
    // raw means the same as EdithorProps#input, this is redundant but might be useful in the future, right now
    // it's here for coding context only
    raw: string,

    processed: string
};

export default class Edithor extends Component<EdithorProps, EdithorComponentState> {
    static Editor = Editor;
    static Renderer = Renderer;

    rules: EdithorRule[];

    componentDidMount(): void {
        this.rulesDidUpdate();
    };

    componentDidUpdate(previousProps: Readonly<EdithorProps>): void {
        // TODO: maybe revisit JSON.stringify() === JSON.stringify(), maybe not

        // updating the rules also updates the input afterwards
        if(JSON.stringify(previousProps.rules) !== JSON.stringify(this.props.rules)) {
            this.props.debug === "all" && console.warn("Edithor rules has been changed.");

            this.rulesDidUpdate();
        }
        else if(previousProps.input !== this.props.input) {
            this.props.debug === "all" && console.warn("Edithor input has been changed.");

            this.inputDidUpdate();
        }
    };

    rulesDidUpdate() {
        const timestamp = performance.now();

        const rulesKeys: string[] = Object.keys(Rules);
        const filteredRulesKeys: string[] = rulesKeys.filter((rule: string) => {
            if(this.props.rules[rule] === undefined)
                return true;

            const type: string = typeof this.props.rules[rule];

            if(type === "boolean")
                return !!this.props.rules[rule];

            if(type === "object")
                return this.props.rules[rule]["enabled"];

            // we should never get to this state, and it's only possible in regular js
            throw new Error(`Edithor rule ${rule} has an invalid value type of ${type}.`);
        });

        this.props.debug && console.debug("Edithor enabled rules: ", filteredRulesKeys);

        // intialize the rules and then emulate an input change to cause a refresh in the child components
        // because the child components are not aware of the rules.

        this.setState({
            rules: filteredRulesKeys.map((rule) => {
                const options = (typeof this.props.rules[rule] === "object")?(this.props.rules[rule]):({});

                return new Rules[rule](options);
            })
        }, () => {
            this.props.debug === "all" && console.debug("Edithor processing rules:", performance.now() - timestamp);
            
            this.inputDidUpdate();
        });
    };

    inputDidUpdate() {
        const timestamp = performance.now();

        const raw = this.props.input;

        let processed:string = raw;

        // here we would implement our custom logic to set the "rules" state
        // e.g. define that we're in a code block now

        // for safety, I think the process should be like this:
        // eject the code blocks (e.g. ```(.*?)```) and process the sections individually
        // e.g. first everything up to the first code block opening, then the code block itself, then everything below
        //      the code block closing, the code block obviously being N
        // this is only a special scenario since code blocks contains code, unlike the rest of the content which is just text and markup

        // this is what the "difficult" task will be, mostly due to performance concerns

        const beforeHtmlEntitiesRules = this.state?.rules.filter((rule) => rule.conditions.beforeHtmlEntities);
        beforeHtmlEntitiesRules.forEach((rule) => processed = rule.process(processed));

        // this turns _every non-digit/English alphabetic_ character into a HTML entity
        // this is perfectly reasonable. it will not affect network bandwidth - this is client code
        // and it's a perfect XSS prevention.

        // in all our rules, because of this, we use the HTML entities to decode character
        // such as line feeds (\n) and carriage returns (\r)

        processed = processed.replaceAll(
            /[^0-9A-Za-z ]/g,
            c => "&#" + c.charCodeAt(0) + ";"
        );

        const afterHtmlEntitiesRules = this.state?.rules.filter((rule) => !rule.conditions.beforeHtmlEntities);
        afterHtmlEntitiesRules.forEach((rule) => processed = rule.process(processed));

        // once it's processed, pass it over to our child components - as props
        // see comments at the top about the child components not being in control of the Edithor™ states

        this.setState({
            edithor: {
                raw: this.props.input,
                processed
            }
        }, () => {
            this.props.debug === "all" && console.debug("Edithor processing input:", performance.now() - timestamp);
        });
    };

    render() {
        /// TODO: this shouldn't be necessary
        if(!this.state)
            return null;

        const children = React.Children.map(this.props.children, (child) => {
            if(React.isValidElement(child))
                return React.cloneElement(child, { edithor: this.state.edithor } as any);
            
            return child;
        });

        this.props.debug === "all" && console.debug("Edithor rendered with children: ", children);

        return children;
    };
};
