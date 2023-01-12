import EmitLineComments from "./emit-line-comments";
import EnableLineBreakElements from "./enable-line-break-element";

// with consideration that default value of unset values will be undefined
// all names should indicate an enablement of the disabled value and the negative
// value should indicate the default behaviour to avoid bad checks

// (bad) omit-full-line-comments (default undefined, false):  enabled !== undefined && enabled === false
// (good) emit-full-line-comments (default undefined, false): enabled === true

export default {
    "emit-line-comments": EmitLineComments,
    "enable-line-break-element": EnableLineBreakElements
};
