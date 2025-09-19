import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  style?: any;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="error-outline" size={48} color="#F44336" />
          </View>
          <Title style={styles.title}>{title}</Title>
          <Paragraph style={styles.message}>{message}</Paragraph>
          {onRetry && (
            <Button
              mode="outlined"
              onPress={onRetry}
              style={styles.retryButton}
              icon="refresh"
            >
              Try Again
            </Button>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    elevation: 2,
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1C1B1F',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#49454F',
    lineHeight: 24,
  },
  retryButton: {
    minWidth: 120,
  },
});