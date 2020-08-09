import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import {Feather} from '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage'

import TeacherItem,{Teacher} from '../../components/TeacherItem';
import PageHeader from '../../components/PageHeader';
import api from '../../services/api';


import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList() {
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [favorites, setFavorites] = useState<number[]>([])

    const [teachers, setTeachers] = useState([])
    const [subject, setSubject] = useState('');
    const [week_day, setWeek_day] = useState('');
    const [time, setTime] = useState('');

    function loadFavortites(){
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachers = JSON.parse(response)
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
                    return teacher.id
                })

                setFavorites(favoritedTeachersIds);
            }
        });
    }

    useFocusEffect(() =>{
        loadFavortites()
    })

    function handleToggleFiltersVisible(){
        setIsFilterVisible(!isFilterVisible)
    }

    async function handleFiltersSubmit() {
        loadFavortites();

        const response = await api.get('classes',{
            params: {
                subject,
                week_day,
                time
            }
        })

        setIsFilterVisible(false);
        setTeachers(response.data);
    }

    return (
        <View style={styles.container}>
            <PageHeader
                title="Proffys disponíveis"
                headerRight={(
                    <BorderlessButton onPress={handleToggleFiltersVisible}>
                        <Feather name="filter" size={20} color="#FFF" />
                    </BorderlessButton>
                )}
            >
                { isFilterVisible && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput
                            style={styles.input}
                            value={subject} 
                            onChangeText={text => setSubject(text)}
                            placeholderTextColor="#c1bccc"
                            placeholder="Qual a matéria?"
                        />

                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                            <Text style={styles.label}>Dia da semana</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={week_day} 
                                    onChangeText={text => setWeek_day(text)}
                                    placeholderTextColor="#c1bccc"
                                    placeholder="Qual o dia?"
                                />
                            </View>

                            <View style={styles.inputBlock}>
                            <Text style={styles.label}>Horário</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={time} 
                                    onChangeText={text => setTime(text)}
                                    placeholderTextColor="#c1bccc"
                                    placeholder="Qual horário?"
                                />
                            </View>
                        </View>
                        <RectButton onPress= {handleFiltersSubmit} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>

                        </RectButton>
                    </View>
                )}
            </PageHeader>

            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingBottom: 16,
                    paddingHorizontal: 16
                }}
            >
                {teachers.map((teacher: Teacher) => {
                    return (
                        <TeacherItem
                            key={teacher.id}
                            teacher={teacher}
                            favorited={favorites.includes(teacher.id)}
                        />)
                })}
            </ScrollView>  
        </View>
    );
}

export default TeacherList;