import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const features = [
    {
      title: 'Fast Performance',
      description: 'Built with React Native and Expo for optimal performance',
      icon: 'speed' as const,
      color: '#4CAF50',
    },
    {
      title: 'Material Design 3',
      description: 'Beautiful, modern design system across all platforms',
      icon: 'palette' as const,
      color: '#2196F3',
    },
    {
      title: 'Type Safe',
      description: 'Full TypeScript support with shared types',
      icon: 'security' as const,
      color: '#FF9800',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Title style={styles.title}>Welcome to Your App</Title>
        <Paragraph style={styles.subtitle}>
          A modern mobile application built with React Native and Material Design 3
        </Paragraph>
      </View>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => console.log('Get Started pressed')}
          style={styles.primaryButton}
          icon="rocket-launch"
        >
          Get Started
        </Button>
        <Button
          mode="outlined"
          onPress={() => console.log('Learn More pressed')}
          style={styles.secondaryButton}
          icon="info"
        >
          Learn More
        </Button>
      </View>

      <View style={styles.features}>
        {features.map((feature, index) => (
          <Card key={index} style={styles.featureCard}>
            <Card.Content>
              <View style={styles.featureHeader}>
                <MaterialIcons
                  name={feature.icon}
                  size={24}
                  color={feature.color}
                />
                <Title style={styles.featureTitle}>{feature.title}</Title>
              </View>
              <Paragraph style={styles.featureDescription}>
                {feature.description}
              </Paragraph>
            </Card.Content>
          </Card>
        ))}
      </View>

      <View style={styles.tags}>
        <Chip mode="outlined" style={styles.chip}>React Native</Chip>
        <Chip mode="outlined" style={styles.chip}>Expo</Chip>
        <Chip mode="outlined" style={styles.chip}>Material Design 3</Chip>
        <Chip mode="outlined" style={styles.chip}>TypeScript</Chip>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1C1B1F',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#49454F',
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
  },
  primaryButton: {
    flex: 1,
    maxWidth: 150,
  },
  secondaryButton: {
    flex: 1,
    maxWidth: 150,
  },
  features: {
    marginBottom: 30,
  },
  featureCard: {
    marginBottom: 16,
    elevation: 2,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#49454F',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  chip: {
    marginBottom: 8,
  },
});