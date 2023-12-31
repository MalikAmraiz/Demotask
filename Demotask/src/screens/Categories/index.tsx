import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Entypo';
import EmptyListComponent from '../../components/EmptyList';
import Header from '../../components/Header';
import {fetchAllCategories} from '../../services';
import RootStackParamList from '../../types';
import {styles} from './styles';
type CategoriesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Categories'
>;

interface CategoriesScreenProps {
  navigation: CategoriesScreenNavigationProp;
}
const Categories: React.FC<CategoriesScreenProps> = ({navigation}) => {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchData();
  }, []);
  // Function to fetch categories list
  const fetchData = async () => {
    try {
      let categories = await fetchAllCategories();
      setData(categories);
    } catch (error) {
      console.log('error while fetching categories', error);
    } finally {
      setLoading(false);
    }
  };
  // Function to handle category selection
  const handleCategorySelect = (category: string) => {
    // Navigate to the products screen for the selected category
    navigation.navigate('ProductList', {category});
  };

  // Render each category item
  const renderCategoryItem = ({item}: {item: string}) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategorySelect(item)}>
      <Text style={styles.categoryText}>{item}</Text>
      <Icon
        name={'chevron-right'}
        size={responsiveFontSize(2)}
        color={'gray'}
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Categories" cartPress />
        <ActivityIndicator
          color={'black'}
          size={'small'}
          style={{marginTop: responsiveHeight(40), alignSelf: 'center'}}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Header title="Categories" cartPress />
      <View style={styles.wrapper}>
        <View style={styles.rowView}>
          <Text style={styles.title}>Categories</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ProductList', {category: ''});
            }}>
            <Text style={styles.allProductsText}>All Products</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          contentContainerStyle={{paddingBottom: responsiveHeight(5)}}
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderCategoryItem}
          ListEmptyComponent={EmptyListComponent}
        />
      </View>
    </View>
  );
};

export default Categories;
