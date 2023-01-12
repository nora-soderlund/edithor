// with consideration that default value of uninitialized type properties will be undefined
// all property names should indicate an enablement of the disabled value and the negative

// value should indicate the default behaviour to avoid checks
// (bad) omitFullLineComments (default false): omitFullLineComments !== undefined && omitFullLineComments === false
// (good) emitFullLineComments (default false): emitFullLineComments === true

export type RendererOptions = {
    emitFullLineComments?: boolean,
    emitBlockComments?: boolean
};
