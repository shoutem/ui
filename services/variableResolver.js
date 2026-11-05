import _ from 'lodash';
import autoBind from 'auto-bind';

const THEME_EXTENSION_SCOPE = 'shoutem.theme';

// A theme value starting with this prefix is a reference to another theme
// variable (e.g. `@paperColor`, `@text.fontFamily`), not a literal.
const REFERENCE_PREFIX = '@';

// How many references may be followed in a row before resolution gives up,
// which also stops reference cycles (`a -> b -> a`).
const MAX_REFERENCE_DEPTH = 5;

// How deep nested theme objects are scanned for references. Real theme
// variables are shallow; the cap only guards against self-referencing objects.
const MAX_OBJECT_DEPTH = 10;

/**
 * Checks whether a value is a reference to another theme variable.
 *
 * @param {*} value The value to check.
 * @returns {boolean} True for strings like `@paperColor`.
 */
const isReference = value =>
  _.isString(value) &&
  value.length > REFERENCE_PREFIX.length &&
  _.startsWith(value, REFERENCE_PREFIX);

/**
 * Merges plain objects into a fresh one. Unlike a plain `_.merge`, arrays from
 * a later source replace the earlier array instead of being merged by index.
 *
 * @param {...Object} sources The objects to merge, later ones win.
 * @returns {Object} The merged object.
 */
const mergeReplacingArrays = (...sources) =>
  _.mergeWith({}, ...sources, (objValue, srcValue) =>
    _.isArray(srcValue) ? srcValue : undefined,
  );

export class ThemeVariableResolver {
  constructor(variables) {
    this.variables = { ...variables };

    autoBind(this);
  }

  setVariables(variables) {
    this.variables = { ...variables };
  }

  /**
   * Reads a variable without dereferencing it: first from the given scope,
   * then from the theme root.
   *
   * @param {string} scope Dotted extension scope, e.g. `shoutem.widgets`.
   * @param {string} variable Dotted variable path, e.g. `titleFont.color`.
   * @returns {*} The stored value, tokens such as `@paperColor` untouched.
   */
  getRawScopedVariable(scope, variable) {
    const scopePath = _.split(scope, '.');
    const variablePath = _.split(variable, '.');

    return _.get(
      this.variables,
      [...scopePath, ...variablePath],
      _.get(this.variables, variablePath),
    );
  }

  /**
   * Follows a reference token (`@name`) through the scope tier and then the
   * theme root, following further references up to `MAX_REFERENCE_DEPTH` hops.
   *
   * @param {string} scope Dotted extension scope the lookup starts from.
   * @param {string} reference The reference token, including the `@` prefix.
   * @param {number} depth How many references were followed already.
   * @returns {*} The resolved value, or `undefined` when the reference cannot
   *   be resolved (missing variable, or the depth limit was hit).
   */
  resolveReference(scope, reference, depth) {
    if (depth >= MAX_REFERENCE_DEPTH) {
      return undefined;
    }

    const target = this.getRawScopedVariable(
      scope,
      reference.slice(REFERENCE_PREFIX.length),
    );

    return this.dereferenceValue(scope, target, depth + 1, false);
  }

  /**
   * Replaces reference tokens in a value. A string token is resolved, a plain
   * object gets its leaves dereferenced. Objects are copied only when a leaf
   * actually changed, so untouched theme objects keep their identity.
   *
   * @param {string} scope Dotted extension scope references are resolved from.
   * @param {*} value The value to dereference.
   * @param {number} depth How many references were followed already.
   * @param {boolean} keepUnresolved When true an unresolvable token stays as
   *   it is (backwards compatible reads); when false it is dropped (becomes
   *   `undefined`, or is removed from its parent object).
   * @param {number} level How deep inside nested objects the value is.
   * @returns {*} The dereferenced value.
   */
  dereferenceValue(scope, value, depth = 0, keepUnresolved = true, level = 0) {
    if (isReference(value)) {
      const resolved = this.resolveReference(scope, value, depth);

      return resolved === undefined && keepUnresolved ? value : resolved;
    }

    if (!_.isPlainObject(value) || level >= MAX_OBJECT_DEPTH) {
      return value;
    }

    let _result = value;

    _.forOwn(value, (leaf, key) => {
      const resolved = this.dereferenceValue(
        scope,
        leaf,
        depth,
        keepUnresolved,
        level + 1,
      );

      if (resolved === leaf) {
        return;
      }

      if (_result === value) {
        _result = { ...value };
      }

      if (resolved === undefined) {
        delete _result[key];
      } else {
        _result[key] = resolved;
      }
    });

    return _result;
  }

  getScopedVariable(scope, variable) {
    if (!this.variables || _.isEmpty(this.variables)) {
      throw new Error(
        'Theme variable resolver not yet initialised. Please call `setVariables` prior to this function call',
      );
    }

    return this.dereferenceValue(
      scope,
      this.getRawScopedVariable(scope, variable),
    );
  }

  // Currently supports 2 function signatures
  // resolveVariable(variableName) -> Tries to get the variable under the root scope ( generic theme values )
  // resolveVariable(scope, variableName) -> Tries to get the variable under specific scope
  // Variable name can be stringified object path or a regular string, i.e -> text.color
  resolveVariable(...params) {
    if (arguments.length === 1) {
      const variablePath = _.split(params[0], '.');
    
      return _.get(this.variables, variablePath);
    }

    if (arguments.length === 2) {
      return this.getScopedVariable(params[0], params[1]);
    }

    throw new Error(
      "Invalid theme variable resolution call. Please use full signature \n-> resolveVariable(scope, variableName),\n or the shorthand if you're getting a variable from shoutem.theme extension \n->resolveVariable(variableName)",
    );
  }

  createScopedResolver(scope) {
    return (...params) => {
      if (params.length === 1) {
        return this.getScopedVariable(scope, params[0]);
      }
      if (params.length === 2) {
        return this.getScopedVariable(params[0], params[1]);
      }

      return undefined;
    };
  }

  /**
   * Resolves an override value read from a layer: a reference token is
   * followed, a plain object has its leaves resolved and its unset (`null` /
   * `undefined`) or unresolvable leaves removed, so it can be merged over an
   * inherited object without wiping fields.
   *
   * @param {string} scope Dotted extension scope references are resolved from.
   * @param {*} value The raw override value.
   * @param {number} level How deep inside nested objects the value is.
   * @returns {*} The resolved override; `undefined` when a reference cannot be
   *   resolved.
   */
  resolveOverrideValue(scope, value, level = 0) {
    if (isReference(value)) {
      return this.resolveReference(scope, value, 0);
    }

    if (!_.isPlainObject(value) || level >= MAX_OBJECT_DEPTH) {
      return value;
    }

    const result = {};

    _.forOwn(value, (leaf, key) => {
      const resolved = this.resolveOverrideValue(scope, leaf, level + 1);

      if (!_.isNil(resolved)) {
        result[key] = resolved;
      }
    });

    return result;
  }

  /**
   * Resolves one variable through the override layers on top of the scoped
   * lookup. Layers are applied from the lowest to the highest priority: the
   * inherited (scope, then theme root) value is the base, every layer that has
   * a value for the variable replaces it - or, when both are plain objects,
   * is merged over it.
   *
   * @param {string} scope Dotted extension scope the variable belongs to.
   * @param {string} name Dotted variable path, e.g. `titleFont.color`.
   * @param {Array<Object>} layers Override objects, highest priority first.
   * @returns {*} The resolved value.
   */
  resolveLayeredVariable(scope, name, layers) {
    const path = _.split(name, '.');

    let _current = this.getScopedVariable(scope, name);

    _.forEachRight(layers, layer => {
      const resolved = this.resolveOverrideValue(scope, _.get(layer, path));

      if (_.isNil(resolved)) {
        return;
      }

      _current =
        _.isPlainObject(resolved) && _.isPlainObject(_current)
          ? mergeReplacingArrays(_current, resolved)
          : resolved;
    });

    return _current;
  }

  /**
   * Creates a resolver that layers sparse overrides on top of a scoped
   * resolver, with the same signature: `resolve(name)` or `resolve(scope,
   * name)`. For a variable the cascade is: `overrides[group]`, then
   * `overrides` itself, then the extension scope, then the theme root. A
   * `null`/`undefined` override means "not set" and falls through to the next
   * tier. A string override starting with `@` is a reference to another theme
   * variable and is resolved like the theme values are; a plain object
   * override is merged over the inherited object, field by field.
   *
   * Group and variable keys may contain dots (a group is a canonical screen
   * type), so overrides are always read with array paths, never dotted strings.
   * Overrides apply only to variables read from `scope`; a 2-argument call for
   * another scope is a plain scoped lookup.
   *
   * @param {string} scope Dotted extension scope, e.g. `shoutem.widgets`.
   * @param {Object} [overrides] Sparse override object: root keys are shared
   *   variables, a key equal to `group` holds that group's variables.
   * @param {string} [group] Key of the override group to apply on top of the
   *   shared root keys.
   * @returns {Function} The layered resolver.
   */
  createLayeredResolver(scope, overrides, group) {
    const root = _.isPlainObject(overrides) ? overrides : undefined;
    const groupOverrides =
      root && group && _.isPlainObject(root[group]) ? root[group] : undefined;
    const layers = _.compact([groupOverrides, root]);

    const resolve = (requestScope, name) => {
      if (requestScope !== scope || _.isEmpty(layers)) {
        return this.getScopedVariable(requestScope, name);
      }

      return this.resolveLayeredVariable(requestScope, name, layers);
    };

    return (...params) => {
      if (params.length === 1) {
        return resolve(scope, params[0]);
      }
      if (params.length === 2) {
        return resolve(params[0], params[1]);
      }

      return undefined;
    };
  }
}

// Expose both, the resolver service, and the default resolver working with
// shoutem default theme. This way the logic can be used for multiple themes/resolvers, or
// if needed, you can override the default theme variables using the setVariables method
export const defaultResolver = new ThemeVariableResolver();
export const resolveVariable = defaultResolver.resolveVariable;
export const createScopedResolver = defaultResolver.createScopedResolver;
export const createLayeredResolver = defaultResolver.createLayeredResolver;
