import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function BirthTimeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  const handleContinue = () => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const birthTime = `${hours}:${minutes}`;

    router.push({
      pathname: '/(onboarding)/birth-location',
      params: {
        displayName: params.displayName as string,
        birthDate: params.birthDate as string,
        birthTime,
      },
    });
  };

  const onChange = (_event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.progress}>Step 3 of 4</Text>
        <Text style={styles.title}>What time were you born?</Text>
        <Text style={styles.subtitle}>
          Your birth time helps us calculate your rising sign (ascendant)
        </Text>

        <View style={styles.pickerContainer}>
          {Platform.OS === 'android' && !showPicker && (
            <Pressable style={styles.timeButton} onPress={() => setShowPicker(true)}>
              <Text style={styles.timeButtonText}>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </Pressable>
          )}
          {showPicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChange}
            />
          )}
        </View>

        <Text style={styles.hint}>Don't know your exact birth time? That's okay!</Text>
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
  timeButton: {
    backgroundColor: '#f3e8ff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    width: '100%',
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 18,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  hint: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 20,
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
