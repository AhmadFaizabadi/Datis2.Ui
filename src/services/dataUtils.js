export function groupByKeys(data, keys, labels, rootNode) {
  rootNode.children = rootNode.children || [];
  rootNode.parent = ""; // Ensure the root node has a parent property set to ""
  rootNode.name = rootNode.id;
  let uniqueIdCounter = 0; // Counter for unique ID generation

  // Helper function to generate unique IDs
  function generateUniqueId(baseId) {
    return `${baseId}-${uniqueIdCounter++}`;
  }

  // Helper function to find or create a node in the tree
  function findOrCreateNode(arr, value, label, parentId) {
    let node = arr.find(
      (item) => item.value === value && item.parent === parentId
    );
    if (!node) {
      const uniqueId = generateUniqueId(value);
      node = {
        id: uniqueId,
        value,
        label,
        name: value,
        children: [],
        parent: parentId,
      };
      arr.push(node);
    }
    return node;
  }

  data.forEach((item) => {
    let currentLevel = rootNode.children;
    let parentId = rootNode.id; // Use the root node's ID for the first level

    keys.forEach((key, index) => {
      const value = item[key];
      const label = `${labels[index]}: ${value}`; // Create the base label
      const node = findOrCreateNode(currentLevel, value, label, parentId);

      // Move to the next level (children) for further nesting
      currentLevel = node.children;
      parentId = node.id;

      // If it's the last key, push the original item with its label and parent ID
      if (index === keys.length - 1) {
        const uniqueId = generateUniqueId(item.id);
        const labeledItem = {
          ...item,
          id: uniqueId,
          label: `${labels[index]}: ${value}`,
          name: item.id,
          parent: parentId,
          children: [],
        };
        currentLevel.push(labeledItem);
      }
    });
  });

  // Helper function to calculate the count of children recursively
  function calculateChildCount(node) {
    if (!node.children || node.children.length === 0) {
      node.label = `${node.label} (1 item)`;
      return 1;
    }

    let count = 0;
    node.children.forEach((child) => {
      count += calculateChildCount(child);
    });

    node.label = `${node.label} (${count} items)`;

    // Sort children based on their count in descending order
    node.children.sort((a, b) => {
      const aCount = parseInt(a.label.match(/\((\d+) items\)/)?.[1] || 1, 10);
      const bCount = parseInt(b.label.match(/\((\d+) items\)/)?.[1] || 1, 10);
      return bCount - aCount;
    });

    return count;
  }

  // Apply the recursive counting and sorting to the root node
  calculateChildCount(rootNode);

  return rootNode;
}

export function flattenTree(node) {
  let result = [];

  // Helper function to recursively traverse the tree
  function traverse(currentNode) {
    // Add the current node to the result array (excluding its children property)
    const { children, ...nodeWithoutChildren } = currentNode;
    result.push(nodeWithoutChildren);

    // Recursively traverse each child node
    if (children && children.length > 0) {
      children.forEach((child) => traverse(child));
    }
  }

  // Start traversal from the root node
  traverse(node);

  return result;
}

export function aggregateChildren(node) {
  let aggregated = [];

  // Base case: if the node has no children, return an empty array
  if (!node.children || node.children.length === 0) {
    // aggregated.push(node); // Add the current node if it has no children (leaf node)
    // return aggregated;
    return node;
  }

  // Recursive case: iterate over the children and aggregate their children
  node.children.forEach((child) => {
    // Recursively aggregate the child's children
    aggregated = aggregated.concat(aggregateChildren(child));
  });

  return aggregated;
}

export function ExtractCountFromLabel(label) {
  return parseInt(label?.match(/\((\d+) items\)/)?.[1] || 1, 10);
}

export function ExtractValueFromLabel(label) {
  return label?.match(/: (.*?) \(/)?.[1];
}
export function ExtractKeyFromLabel(label) {
  return label?.match(/(.*?):/)?.[1];
}

export function RemoveItemsFromLabel(label) {
  return label?.replaceAll(/\s*\(.*?\)/g, "");
}

export function GroupByKey(items, key) {
  return items.reduce((acc, item) => {
    if (!acc.includes(item[key])) {
      acc.push(item[key]);
    }
    return acc;
  }, []);
}
