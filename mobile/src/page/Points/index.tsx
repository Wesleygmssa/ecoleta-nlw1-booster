//http://192.168.1.102:3333/uploads/lampadas.svg
//http://172.16.0.7:3333/uploads/lampadas.svg

import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons'; // icones
import { useNavigation, useRoute} from '@react-navigation/native' // para navegação
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Image, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';
import api from '../../services/api';


interface Item {
  id: number,
  title: string,
  image_url: string,

}

interface Point {
  id: number,
  name: string,
  image: string,
  latitude: number,
  longitude: number,

}

interface Params {
  uf: string,
  city: string
}


const Points = () => {
  const [items, setItems] = useState<Item[]>([]);// salvando items
  const [points, setPoints] = useState<Point[]>([]); // salvando resultado dos pontos
  const [selectedItems, setSelectedItems] = useState<number[]>([]); //array de numeros
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]); //pegando posição do mapa

  const navigation = useNavigation();
  const route = useRoute(); //pegando parametros pela rota

  const routeParams =  route.params as Params;

  useEffect(() => { //localização

    async function loadPosition() {

      const { status } = await Location.requestPermissionsAsync(); //permisssão ?

      if (status !== 'granted') {
        Alert.alert('Oooops...', 'Precisamos de sua permissão para obter a localização');
        return;
      }

      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords; // pegando coordenada

      // console.log(latitude, longitude)

      setInitialPosition([
        latitude,
        longitude,
      ])
    }

    loadPosition()
  }, []);

  useEffect(() => { // items, Lâmpadas, Pilhas e etc...

    api.get('items').then(response => {

      setItems(response.data);
    });

  }, []);

  useEffect(() => { // pegando resultado dos pontos cadastrado no mapa.

    api.get('points', {
      params: {
        city: routeParams.city,
        uf: routeParams.uf,
        items: selectedItems
      }
    }).then(response => {

      setPoints(response.data);// mudaça de estado , passando resultado da api
    });

  }, [selectedItems]);

  function handleNavigateBack() {
    navigation.goBack(); // voltar para tela anterior
  }

  function handleNavigateToDetail(id: number) {

    navigation.navigate('Detail', {point_id: id});// passando como paramentro na proxima rota

  }

  function handleSelectedItem(id: number) {

    const alreadySelected = selectedItems.findIndex(item => item == id);

    if (alreadySelected >= 0) {

      const filteredItems = selectedItems.filter(item => item !== id); // remover

      setSelectedItems([...filteredItems]);

    } else {

      setSelectedItems([...selectedItems, id]); //add
    }


  }
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack} >
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>Econtre no mapa um ponto de coleta.</Text>

        <View style={styles.mapContainer}>

          {initialPosition[0] !== 0 && (

            <MapView style={styles.map}  // mapa


              initialRegion={{

                latitude: initialPosition[0],
                longitude: initialPosition[1],

                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}>

              {points.map(point => ( //percorrenso cada um dos pontos

                <Marker // marcação no mapa
                  key={String(point.id)}
                  onPress={()=>handleNavigateToDetail(point.id)}
                  style={styles.mapMarker}
                  coordinate={{ // ponto no mapa
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}>

                  <View style={styles.mapMarkerContainer}>
                    <Image style={styles.mapMarkerImage} source={{ uri: point.image }} />
                <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>

              ))}

            </MapView>

          )}

        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>

          {items.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {}
              ]}
              onPress={() => handleSelectedItem(item.id)}
              activeOpacity={0.6}
            >
              <SvgUri width={50} height={45} uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}


        </ScrollView>

      </View>

    </>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points;