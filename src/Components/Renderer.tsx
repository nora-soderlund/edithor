import { Component } from "react";
import { EdithorState } from "..";

type RendererProps = {
    edithor: EdithorState
};

type RendererState = {};

export default class Renderer extends Component<RendererProps, RendererState> {
    render() {
        return (
            <div dangerouslySetInnerHTML={{ __html: this.props.edithor?.processed }}/>
        );
    };
};
