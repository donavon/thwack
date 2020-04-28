const resolveOptionsFromArgs = (args) =>
  args.length > 1 // url, options?
    ? { ...args[1], url: args[0] } // yes, use a combined options
    : args[0]; // no, use the original options

export default resolveOptionsFromArgs;
