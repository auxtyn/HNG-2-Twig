# Ticket Management System - Twig Conversion

This project has been converted from a React-based frontend application to a Twig-based backend application.

## Structure

### Templates
- `templates/layout.twig` - Base layout template
- `templates/landing.twig` - Landing page
- `templates/login.twig` - Login form
- `templates/register.twig` - Registration form
- `templates/dashboard.twig` - Dashboard with stats
- `templates/ticket_list.twig` - Ticket listing page

### Controllers
- `src/Controller/AuthController.php` - Handles authentication
- `src/Controller/DefaultController.php` - Handles main pages

### Services
- `src/Service/AuthService.php` - Authentication logic

### Configuration
- `config/routes.php` - Route definitions
- `composer.json` - PHP dependencies
- `public/index.php` - Entry point

## Setup

1. Install PHP dependencies:
   ```bash
   composer install
   ```

2. Ensure data directories exist:
   ```bash
   mkdir -p data cache/twig
   ```

3. Start the server:
   ```bash
   php -S localhost:8000 public/index.php
   ```

## Key Changes from React

1. **Component Structure**: JSX components converted to Twig templates
2. **State Management**: React hooks replaced with PHP session management and controller logic
3. **Routing**: React Router replaced with PHP-based routing
4. **Styling**: Maintained Tailwind CSS classes
5. **Data Flow**: Client-side state replaced with server-side data handling

## Features Converted

- Landing page with feature showcase
- User authentication (login/register)
- Dashboard with ticket statistics
- Ticket listing with filtering
- Responsive design maintained

## Demo Credentials

- **Admin**: admin / admin123
- **User**: user / user123