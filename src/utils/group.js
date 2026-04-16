export function groupByType(items) {
  return items.reduce((acc, item) => {
    const type = item["doc-type"] || item.docType || "other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});
}

export function groupByMonth(items) {
  return items.reduce((acc, item) => {
    const date = item.timestamp ? new Date(item.timestamp * 1000) : new Date();
    const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

export function groupByNetwork(items) {
  return items.reduce((acc, item) => {
    const net = item.network || "stacks";
    if (!acc[net]) acc[net] = [];
    acc[net].push(item);
    return acc;
  }, {});
}