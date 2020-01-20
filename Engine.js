const MergeSort = require('./MergeSort');

module.exports = class Engine {
    execute = (rules, input, quickReturn) => {
        const mergeSort = new MergeSort();
        mergeSort.recursive(rules, 0, rules.Length - 1);

        let response = {then: [], else: []};
        for (let i = 0, rule; rule = rules[i]; i++) {
            if (this.processConditions(rule.conditions, input)) {
                if (Array.isArray(rule.actions.then) && rule.actions.then.length > 0)
                    response.then.push(rule.actions.then);
            } else {
                if (Array.isArray(rule.actions.else) && rule.actions.else.length > 0)
                    response.else.push(rule.actions.else);
            }

            if ((response.then.length > 0 || response.else.length > 0) && quickReturn) 
                break;
        }
        
        return response;
    }

    processConditions = (conditions, input) => {
        const keys = Object.keys(conditions);
        let any, all = false;
        if (keys.includes("any") && conditions.any.length > 0) {
            for (let i = 0, condition; condition = conditions.any[i]; i++) {
                if (this.processConditions(condition, input)) {
                    any = true;
                    break;
                }
            }
        }

        if (!any && keys.includes("all") && conditions.all.length > 0) {
            for (let i = 0, condition; condition = conditions.all[i]; i++) {
                if (!this.processConditions(condition, input)) {
                    all = false;
                    break;
                }

                all = true;
            }
        }

        if (keys.includes("name")) 
            return this.processCondition(conditions, input);

        return (any || all);
    }

    processCondition = (condition, input) => {
        switch (condition.type) {
            case "bool": return this.boolOperator(condition.operator, input[condition.name], condition.value);
            case "numeric": return this.numericOperator(condition.operator, input[condition.name], condition.value);
            case "string": return this.stringOperator(condition.operator, input[condition.name], condition.value);
            default: return false;
        }
    }

    boolOperator = (op, x, y) => ({
        "equal_to": x === y,
        "not_equal_to": x != y
    })[op];

    numericOperator = (op, x, y) => ({
        "greater_than": x > y,
        "less_than": x < y,
        "equal_to": x === y,
        "great_than_equal_to": x >= y,
        "less_than_equal_to": x <= y
    })[op];

    stringOperator = (op, x, y) => ({
        "equal_to": x === y,
        "not_equal_to": x !== y,
        "contains": x.includes(y)
    })[op];
}