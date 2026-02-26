import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function BirthDateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  const handleContinue = () => {
    router.push({
      pathname: '/(onboarding)/birth-time',
      params: { displayName: params.displayName as string, birthDate: date.toISOString() },
    });
  };

  const onChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.progress}>Step 2 of 4</Text>
        <Text style={styles.title}>When were you born?</Text>
        <Text style={styles.subtitle}>
          We'll use this to calculate your sun sign and other astrological placements
        </Text>

        <View style={styles.pickerContainer}>
          {Platform.OS === 'android' && !showPicker && (
            <Pressable style={styles.dateButton} onPress={() => setShowPicker(true)}>
              <Text style={styles.dateButtonText}>{date.toLocaleDateString()}</Text>
            </Pressable>
          )}
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChange}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
            />
          )}
        </View>
      </View>

      <Pressable style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingTop: 60,
  },
  progress: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '600',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 40,
  },
  pickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  dateButton: {
    backgroundColor: '#f3e8ff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    width: '100%',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 18,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#8b5cf6',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
