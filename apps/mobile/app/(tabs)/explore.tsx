import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, List, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function ExploreScreen() {
  const techStack = [
    {
      category: 'Backend',
      technologies: [
        { name: 'NestJS + Fastify', description: 'High-performance Node.js framework' },
        { name: 'Drizzle ORM', description: 'Type-safe database operations' },
        { name: 'PostgreSQL', description: 'Relational database for users, subscriptions' },
        { name: 'MongoDB', description: 'Document database for logs' },
        { name: 'Redis', description: 'Caching and session storage' },
      ],
    },
    {
      category: 'Frontend',
      technologies: [
        { name: 'React + TanStack Router', description: 'Type-safe client-side routing' },
        { name: 'Vite', description: 'Lightning-fast build tool' },
        { name: 'Tailwind CSS', description: 'Utility-first CSS framework' },
        { name: 'shadcn/ui', description: 'Beautiful component library' },
      ],
    },
    {
      category: 'Mobile',
      technologies: [
        { name: 'React Native + Expo', description: 'Cross-platform mobile development' },
        { name: 'Expo Router', description: 'File-based navigation system' },
        { name: 'React Native Paper', description: 'Material Design 3 components' },
      ],
    },
    {
      category: 'DevOps',
      technologies: [
        { name: 'Turborepo', description: 'Monorepo build system' },
        { name: 'Docker', description: 'Containerization platform' },
        { name: 'Vercel', description: 'Frontend deployment and CI/CD' },
        { name: 'GitHub Actions', description: 'Continuous integration' },
      ],
    },
  ];

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'Backend':
        return 'dns' as const;
      case 'Frontend':
        return 'web' as const;
      case 'Mobile':
        return 'smartphone' as const;
      case 'DevOps':
        return 'cloud' as const;
      default:
        return 'code' as const;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Title style={styles.title}>Technology Stack</Title>
        <Paragraph style={styles.subtitle}>
          Explore the modern technologies that power this application
        </Paragraph>
      </View>

      {techStack.map((section, sectionIndex) => (
        <Card key={sectionIndex} style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name={getIconForCategory(section.category)}
                size={24}
                color="#6750A4"
              />
              <Title style={styles.sectionTitle}>{section.category}</Title>
            </View>
            
            {section.technologies.map((tech, techIndex) => (
              <View key={techIndex}>
                <List.Item
                  title={tech.name}
                  description={tech.description}
                  left={(props) => (
                    <List.Icon {...props} icon="chevron-right" color="#6750A4" />
                  )}
                  titleStyle={styles.techTitle}
                  descriptionStyle={styles.techDescription}
                />
                {techIndex < section.technologies.length - 1 && (
                  <Divider style={styles.divider} />
                )}
              </View>
            ))}
          </Card.Content>
        </Card>
      ))}

      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.infoHeader}>
            <MaterialIcons name="info" size={24} color="#2196F3" />
            <Title style={styles.infoTitle}>About This App</Title>
          </View>
          <Paragraph style={styles.infoText}>
            This is a comprehensive full-stack application template that demonstrates
            modern development practices, including monorepo architecture, type safety,
            and cross-platform development with a consistent design system.
          </Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1C1B1F',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#49454F',
    lineHeight: 22,
  },
  sectionCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    marginLeft: 12,
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1B1F',
  },
  techTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1B1F',
  },
  techDescription: {
    fontSize: 14,
    color: '#49454F',
    marginTop: 4,
  },
  divider: {
    marginVertical: 8,
    marginLeft: 40,
  },
  infoCard: {
    marginTop: 8,
    marginBottom: 20,
    elevation: 2,
    backgroundColor: '#E3F2FD',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1B1F',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#49454F',
  },
});