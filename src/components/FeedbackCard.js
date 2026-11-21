
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const SUPPORT_EMAIL = 'victoria.myskiv@gmail.com';

export default function FeedbackCard() {
  const sendEmail = async (subject, message) => {
    const url =
      `mailto:${SUPPORT_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(message)}`;

    try {
      const supported = await Linking.canOpenURL(url);

      if (!supported) {
        Alert.alert(
          'Пошта недоступна',
          `Напиши нам на ${SUPPORT_EMAIL}`
        );
        return;
      }

      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(
        'Не вдалося відкрити пошту',
        `Адреса підтримки: ${SUPPORT_EMAIL}`
      );
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Підтримка та відгуки</Text>

      <Text style={styles.subtitle}>
        Допоможи нам зробити застосунок кращим
      </Text>

      <Pressable
        style={styles.option}
        onPress={() =>
          sendEmail(
            'TaskFlow — повідомлення про проблему',
            'Опиши проблему:\n\n\nПристрій:\nВерсія застосунку:'
          )
        }
      >
        <View style={styles.optionInfo}>
          <Text style={styles.optionTitle}>Повідомити про проблему</Text>
          <Text style={styles.optionDescription}>
            Щось працює неправильно?
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </Pressable>

      <Pressable
        style={styles.option}
        onPress={() =>
          sendEmail(
            'TaskFlow — пропозиція покращення',
            'Моя пропозиція:\n\n'
          )
        }
      >
        <View style={styles.optionInfo}>
          <Text style={styles.optionTitle}>Запропонувати покращення</Text>
          <Text style={styles.optionDescription}>
            Поділися своєю ідеєю
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </Pressable>

      <Text style={styles.email}>{SUPPORT_EMAIL}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222222',
  },
  subtitle: {
    fontSize: 12,
    color: '#999999',
    marginTop: 6,
    marginBottom: 18,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingVertical: 15,
  },
  optionInfo: {
    flex: 1,
    paddingRight: 10,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  optionDescription: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  arrow: {
    fontSize: 23,
    color: '#999999',
  },
  email: {
    fontSize: 12,
    color: '#777777',
    marginTop: 10,
  },
});
