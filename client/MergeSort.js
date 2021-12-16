export default class MergeSort {
  doMerge = (rules, left, mid, right) => {
    const temp = [];
    const leftEnd = mid - 1;
    const numElements = right - left + 1;
    const tempPos = left;

    while (left <= leftEnd && mid <= right) {
      temp[tempPos++] = rules[left].Priority <= rules[mid].Priority ? rules[left++] : rules[mid++];
    }

    while (left <= leftEnd) {
      temp[tempPos++] = rules[left++];
    }

    while (mid <= right) {
      temp[tempPos++] = rules[mid++];
    }

    for (let i = 0; i < numElements; i++) {
      rules[right] = temp[right];
      right--;
    }
  };

  recursive = (rules, left, right) => {
    let mid = 0;

    if (right > left) {
      mid = (right + left) / 2;
      this.mergeRecursive(rules, left, mid);
      this.mergeRecursive(rules, mid + 1, right);
      this.doMerge(rules, left, mid + 1, right);
    }
  };
}
