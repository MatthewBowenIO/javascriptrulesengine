import MergeSort from './MergeSort';

export default class RulesEngine {
  createRulesInput = (stockCode, serialNumberAttributes) => {
    const input = {
      stockCodeId: stockCode.stockCodeId,
      SysProId: stockCode.sysProId,
    };
    Object.keys(serialNumberAttributes)
      .reduce((prev, curr) => prev.concat([serialNumberAttributes[curr]]), [])
      .forEach(sna => {
        if (sna.attributeName) {
          input[sna.attributeName] = sna.valueOptionName || sna.value;

          // Flatten grade values
          if (sna.gradeTypeValueId) {
            input[`${sna.attributeName}_grade`] = sna.gradeTypeValueId;
          }
        }
      });
    return input;
  };

  execute = (rules, input, quickReturn) => {
    const mergeSort = new MergeSort();
    mergeSort.recursive(rules, 0, rules.Length - 1);
    let response = { then: [], else: [] };
    for (let i = 0, rule; (rule = rules[i]); i++) {
      if (this.processConditions(rule.conditions, input)) {
        if (Array.isArray(rule.actions.then) && rule.actions.then.length > 0) {
          rule.actions.then.forEach(x => {
            response.then.push({ priority: rule.priority, ...x });
          });
        }
      } else if (Array.isArray(rule.actions.else) && rule.actions.else.length > 0) {
        rule.actions.else.forEach(x => {
          response.else.push({ priority: rule.priority, ...x });
        });
      }
      if ((response.then.length > 0 || response.else.length > 0) && quickReturn) {
        break;
      }
    }
    const highestPriority = Math.max.apply(
      Math,
      response.then.map(function(o) {
        return o.priority;
      }),
    );
    response = { ...response, then: response.then.filter(x => x.priority == highestPriority) };
    return response;
  };

  processConditions = (conditions, input) => {
    const keys = Object.keys(conditions);
    let any;
    let all = false;
    if (keys.includes('any') && conditions.any.length > 0) {
      for (let i = 0, condition; (condition = conditions.any[i]); i++) {
        if (this.processConditions(condition, input)) {
          any = true;
          break;
        }
      }
    }

    if (!any && keys.includes('all') && conditions.all.length > 0) {
      for (let i = 0, condition; (condition = conditions.all[i]); i++) {
        if (!this.processConditions(condition, input)) {
          all = false;
          break;
        }
        all = true;
      }
    }

    if (keys.includes('name')) {
      return this.processCondition(conditions, input);
    }

    return any || all;
  };

  processCondition = (condition, input) => {
    switch (condition.type) {
      case 'bool':
        return this.boolOperator(condition.operator, input[condition.name], condition.value);
      case 'numeric':
        return this.numericOperator(
          condition.operator,
          parseInt(input[condition.name], 10),
          parseInt(condition.value, 10),
        );
      case 'string':
        return this.stringOperator(
          condition.operator,
          input[condition.name] && input[condition.name].toString().toLowerCase(),
          condition.value.toString().toLowerCase(),
        );
      default:
        return false;
    }
  };

  boolOperator = (op, x, y) =>
    ({
      equal_to: x === y,
      not_equal_to: x != y,
    }[op]);

  numericOperator = (op, x, y) =>
    ({
      greater_than: x > y,
      less_than: x < y,
      equal_to: x === y,
      greater_than_equal_to: x >= y,
      less_than_equal_to: x <= y,
    }[op]);

  stringOperator = (op, x, y) =>
    ({
      equal_to: x === y,
      not_equal_to: x !== y,
      contains: x && x.includes(y),
    }[op]);
}
