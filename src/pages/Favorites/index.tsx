import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import {useFocusEffect} from '@react-navigation/native'

import TeacherItem, { Teacher } from '../../components/TeacherItem';
import PageHeader from '../../components/PageHeader';

import styles from './styles';


function Favorites() {
    const [favorites, setFavorites] = useState([])

    function loadFavortites(){
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachers = JSON.parse(response);

                setFavorites(favoritedTeachers);
            }
        });
    }

    useFocusEffect(() =>{
        loadFavortites();
    })

    return (
        <View style={styles.container}>
            <PageHeader title="Meus proffys favoritos"></PageHeader>

            <ScrollView
                style={styles.favoritesList}
                contentContainerStyle={{
                    paddingBottom: 16,
                    paddingHorizontal: 16
                }}
            >
               {favorites.map((teacher: Teacher) => {
                   return (
                       <TeacherItem
                            key={teacher.id}
                            teacher={teacher}
                            favorited
                       />
                   )
               })}
            </ScrollView>  
        </View>
    );
}

export default Favorites;