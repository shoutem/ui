import _ from 'lodash';
import autoBind from 'auto-bind';

const THEME_EXTENSION_SCOPE = 'shoutem.theme';

export class ThemeVariableResolver {
  constructor(variables) {
    this.variables = { ...variables };

    autoBind(this);
  }

  setVariables(variables) {
    this.variables = { ...variables };
  }

  getScopedVariable(scope, variable) {
    if (!this.variables || _.isEmpty(this.variables)) {
      throw new Error(
        'Theme variable resolver not yet initialised. Please call `setVariables` prior to this function call',
      );
    }

    const variablePath = _.split(variable, '.');

    return _.get(
      this.variables,
      [scope, ...variablePath],
      _.get(this.variables, variablePath),
    );
  }

  // Currently supports 2 function signatures
  // resolveVariable(variableName) -> Tries to get the variable under the shoutem.theme namespace
  // resolveVariable(scope, variableName) -> Tries to get the variable under specific scope
  // Both signatures default to root parameter for the required variable name
  // Variable name can be stringified object path or a regular string, i.e -> text.color
  resolveVariable(...params) {
    if (arguments.length === 1) {
      return this.getScopedVariable(THEME_EXTENSION_SCOPE, params[0]);
    }

    if (arguments.length === 2) {
      return this.getScopedVariable(params[0], params[1]);
    }

    throw new Error(
      "Invalid theme variable resolution call. Please use full signature \n-> resolveVariable(scope, variableName),\n or the shorthand if you're getting a variable from shoutem.theme extension \n->resolveVariable(variableName)",
    );
  }
}

// Expose both, the resolver service, and the default resolver working with
// shoutem default theme. This way the logic can be used for multiple themes/resolvers, or
// if needed, you can override the default theme variables using the setVariables method
export const defaultResolver = new ThemeVariableResolver();
export const resolveVariable = defaultResolver.resolveVariable;
