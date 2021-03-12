import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, FlatList } from "react-native";
import * as SQLite from "expo-sqlite";
import { Icon, Header, Input, ListItem } from "react-native-elements";
import Dialog from "react-native-dialog";

const db = SQLite.openDatabase("shopdb.db");

export default function List({ navigation }) {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [toEdit, setToedit] = useState({});

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists shop (id integer primary key not null, product text, amount text);"
      );
    });
    updateList();
  }, []);

  const saveItem = () => {
    db.transaction(
      (tx) => {
        tx.executeSql("insert into shop (product, amount) values (?, ?);", [
          product,
          amount,
        ]);
      },
      null,
      updateList
    );
    setAmount("");
    setProduct("");
  };

  const updateList = () => {
    db.transaction((tx) => {
      tx.executeSql("select * from shop;", [], (_, { rows }) =>
        setList(rows._array)
      );
    });
  };

  const deleteItem = (id) => {
    db.transaction(
      (tx) => {
        tx.executeSql(`delete from shop where id = ?;`, [id]);
      },
      null,
      updateList
    );
  };

  const updateItem = (id, product, amount) => {
    db.transaction(
      (tx) => {
        tx.executeSql("update shop set product=?, amount=? where id=(?);", [
          product,
          amount,
          id,
        ]);
      },
      null,
      updateList
    );

    handleClose();
  };

  const handleClose = () => {
    setToedit({});
    setVisible(false);
  };

  const handleLongPress = (id, product, amount) => {
    setToedit({
      id: id,
      product: product,
      amount: amount,
    });
    setVisible(true);
  };

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{
          text: "Shopping list",
          style: { color: "#fff", fontSize: 20 },
        }}
      />
      <View style={styles.inputcontainer}>
        <Input
          label="PRODUCT"
          placeholder="Type product name"
          style={styles.input}
          onChangeText={(product) => setProduct(product)}
          value={product}
        />
        <Input
          label="AMOUNT"
          placeholder="Enter the amount"
          style={styles.input}
          onChangeText={(amount) => setAmount(amount)}
          value={amount}
        />
        <View style={styles.input}>
          <Button
            raised
            icon={{ name: "save" }}
            onPress={saveItem}
            title="SAVE"
          />
        </View>
      </View>

      <Dialog.Container visible={visible}>
        <Dialog.Title>Edit item</Dialog.Title>
        <Dialog.Input
          style={styles.modalinput}
          onChangeText={(newproduct) =>
            setToedit({ ...toEdit, product: newproduct })
          }
          value={toEdit.product}
        />
        <Dialog.Input
          style={styles.modalinput}
          onChangeText={(newamount) =>
            setToedit({ ...toEdit, amount: newamount })
          }
          value={toEdit.amount}
        />
        <Dialog.Button label="Cancel" onPress={() => handleClose()} />
        <Dialog.Button
          label="Edit"
          onPress={() => updateItem(toEdit.id, toEdit.product, toEdit.amount)}
        />
      </Dialog.Container>
      <FlatList
        style={styles.listcontainer}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            bottomDivider
            onLongPress={() =>
              handleLongPress(item.id, item.product, item.amount)
            }
          >
            <ListItem.Content>
              <ListItem.Title>{item.product}</ListItem.Title>
              <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
            </ListItem.Content>
            <Icon
              name="trash-alt"
              type="font-awesome-5"
              color="red"
              onPress={() => deleteItem(item.id)}
            />
          </ListItem>
        )}
        data={list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputcontainer: {
    flexDirection: "column",
    width: 250,
    marginTop: 20,
  },
  input: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 18,
  },
  listcontainer: {
    width: 300,
  },

  modalinput: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    fontSize: 16,
  },
});
