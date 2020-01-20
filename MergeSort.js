module.exports = class MergeSort {
    doMerge = (rules, left, mid, right) => {
        let temp = [];
        let left_end, num_elements, tmp_pos;

        left_end = mid - 1;
        num_elements = right - left + 1;
        tmp_post = left;

        while ((left <= left_end) && (mid <= right)) {
            temp[tmp_pos++] = (rules[left].Priority <= rules[mid].Priority) ? rules[left++] : rules[mid++];
        }

        while (left <= left_end) {
            temp[tmp_pos++] = rules[left++];
        }

        while (mid <= right) {
            temp[tmp_pos++] = rules[mid++];
        }

        for (let i = 0; i < num_elements; i++) {
            rules[right] = temp[right];
            right--;
        }
    }

    recursive = (rules, left, right) => {
        let mid = 0;

        if (right > left) {
            mid = (right + left) / 2;
            this.mergeRecursive(rules, left, mid);
            this.mergeRecursive(rules, (mid + 1), right);

            this.doMerge(rules, left, (mid + 1), right);
        }
    }
}