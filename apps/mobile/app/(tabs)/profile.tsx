import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Title, Paragraph, Card, List, Button, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const menuItems = [
    { title: 'Account Settings', icon: 'settings', subtitle: 'Manage your account preferences' },
    { title: 'Notifications', icon: 'notifications', subtitle: 'Configure notification settings' },
    { title: 'Privacy & Security', icon: 'security', subtitle: 'Manage privacy and security options' },
    { title: 'Help & Support', icon: 'help', subtitle: 'Get help and contact support' },
    { title: 'About', icon: 'info', subtitle: 'App version and legal information' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Profile Header */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text size={80} label="JD" style={styles.avatar} />
          <Title style={styles.name}>John Doe</Title>
          <Paragraph style={styles.email}>john.doe@example.com</Paragraph>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Title style={styles.statNumber}>124</Title>
              <Paragraph style={styles.statLabel}>Posts</Paragraph>
            </View>
            <View style={styles.stat}>
              <Title style={styles.statNumber}>1.2K</Title>
              <Paragraph style={styles.statLabel}>Followers</Paragraph>
            </View>
            <View style={styles.stat}>
              <Title style={styles.statNumber}>856</Title>
              <Paragraph style={styles.statLabel}>Following</Paragraph>
            </View>
          </View>
          <Button
            mode="outlined"
            onPress={() => console.log('Edit profile pressed')}
            style={styles.editButton}
            icon="edit"
          >
            Edit Profile
          </Button>
        </Card.Content>
      </Card>

      {/* Menu Items */}
      <Card style={styles.menuCard}>
        <Card.Content style={styles.menuContent}>
          {menuItems.map((item, index) => (
            <View key={index}>
              <List.Item
                title={item.title}
                description={item.subtitle}
                left={(props) => (
                  <MaterialIcons
                    name={item.icon as any}
                    size={24}
                    color="#6750A4"
                    style={{ marginLeft: 8, marginTop: 8 }}
                  />
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => console.log(`${item.title} pressed`)}
                titleStyle={styles.menuTitle}
                descriptionStyle={styles.menuDescription}
              />
              {index < menuItems.length - 1 && <Divider style={styles.menuDivider} />}
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Sign Out */}
      <Card style={styles.signOutCard}>
        <Card.Content>
          <List.Item
            title="Sign Out"
            left={(props) => (
              <MaterialIcons
                name="logout"
                size={24}
                color="#D32F2F"
                style={{ marginLeft: 8, marginTop: 8 }}
              />
            )}
            onPress={() => console.log('Sign out pressed')}
            titleStyle={[styles.menuTitle, { color: '#D32F2F' }]}
          />
        </Card.Content>
      </Card>

      {/* App Version */}
      <View style={styles.footer}>
        <Paragraph style={styles.version}>Version 1.0.0</Paragraph>
      </View>
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
  profileCard: {
    marginBottom: 16,
    elevation: 2,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    backgroundColor: '#6750A4',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1C1B1F',
  },
  email: {
    fontSize: 16,
    color: '#49454F',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1B1F',
  },
  statLabel: {
    fontSize: 14,
    color: '#49454F',
  },
  editButton: {
    minWidth: 120,
  },
  menuCard: {
    marginBottom: 16,
    elevation: 2,
  },
  menuContent: {
    paddingVertical: 8,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1B1F',
  },
  menuDescription: {
    fontSize: 14,
    color: '#49454F',
  },
  menuDivider: {
    marginVertical: 4,
    marginLeft: 56,
  },
  signOutCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFEBEE',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  version: {
    fontSize: 12,
    color: '#49454F',
  },
});