export const storeItemInLocalStorage = (itemKey, item) => {
  let itemString = item;
  if (item instanceof Object) {
    itemString = JSON.stringify(item);
  }
  localStorage.setItem(itemKey, itemString);
};

export const getItemFromLocalStorage = (itemKey) => {
  let item = localStorage.getItem(itemKey);
  try {
    return JSON.parse(item);
  } catch (_) {
    return item;
  }
};

export const removeItemFromLocalStorage = (itemKey) => {
  localStorage.removeItem(itemKey);
};
