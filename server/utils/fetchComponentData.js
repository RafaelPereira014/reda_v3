const { debug } = require('./dataManipulation');

export default function fetchComponentData(dispatch, components, params) {
  const needs = components.reduce( (prev, current) => {
	debug(current, "fetchComponentData");
    return (current.needs || [])
      .concat((current.WrappedComponent ? current.WrappedComponent.needs : []) || [])
      .concat(prev);
  }, []);
  debug(params, "fetchComponentData");
  const promises = needs.map(need => dispatch(need(params)));

  return Promise.all(promises);
}