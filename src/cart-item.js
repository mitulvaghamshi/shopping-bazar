import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import ListItem from "./list-item";

/**
 * Represents a cart with multiple items.
 * all the products are fetched by their ID
 */
export default function CartItem(props) {
  const [cartItem, setCartItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true); // handle component mounting state

  // retrieve individual product in cart
  const getProduct = async (id) => {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);
    const result = await response.json();
    if (result) {
      return result;
    }
  };

  // get all products by repeatedly calling getProduct(with id)
  const getCartProducts = async (products) => {
    let tempList = [];
    for (let i = 0; i < products.length; i++) {
      const item = products[i];
      let product = await getProduct(item.productId);
      // modify product to include quantity
      product["quantity"] = item.quantity;
      tempList.push(product);
    }
    return tempList;
  };

  useEffect(() => {
    const products = props.item.products;
    new Promise.resolve(getCartProducts(products)).then((value) => {
      if (isMounted.current) {
        setCartItem(value);
        setLoading(false);
      }
    });
    return () => {
      isMounted.current = false;
    };
  }, [props.item]);

  return (
    <View style={styles.item}>
      {loading
        ? <ActivityIndicator />
        : cartItem.map((item) => (
          <ListItem key={item.id} isCart={true} product={item} />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({ item: { flex: 1 } });
