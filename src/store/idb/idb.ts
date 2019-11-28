let openRequest = indexedDB.open("store", 1);
const DEVICE_TABLE = {
  name: 'devices',
  id: 'id'
};
const READ_WRITE = 'readwrite';
const READ = 'read';
openRequest.onupgradeneeded = function () {
  const db = openRequest.result;
  if (!db.objectStoreNames.contains(DEVICE_TABLE.name)) {
    db.createObjectStore(DEVICE_TABLE.name, {keyPath: DEVICE_TABLE.id});
  }
};

openRequest.onerror = function () {
  console.error("Error", openRequest.error);
};

openRequest.onsuccess = function () {
  let db = openRequest.result;
};

const getTransaction = (storeName: string = DEVICE_TABLE.name) => {
  const db = openRequest.result
  return db.transaction(storeName, READ_WRITE);
}

const getStore = (storeName: string = DEVICE_TABLE.name) => {
  return getTransaction(storeName).objectStore(storeName);
}

const saveToStore = (data: any, storeName: string = DEVICE_TABLE.name) => {
  let transaction = getTransaction(storeName),
    store = transaction.objectStore(storeName);
  store.add(data);
}

const getAll = (storeName: string = DEVICE_TABLE.name) => {
  return getStore(storeName).getAll();
}

const get = (id: any, storeName: string = DEVICE_TABLE.name) => {
  return getStore(storeName).get(id);
}

export default {
  saveToStore,
  getAll,
  get,
  DEVICE_TABLE
}



