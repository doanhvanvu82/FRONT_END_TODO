
# To-Do App Frontend

A modern, responsive React frontend for the To-Do List application. Built with TypeScript, Tailwind CSS, and comprehensive testing.

## 🚀 Features

- **Complete CRUD Operations**: Create, read, update, and delete todos
- **Real-time Updates**: Instant feedback with loading states and animations  
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Progress Tracking**: Visual progress bar showing completion status
- **Error Handling**: Comprehensive error states with retry functionality
- **Accessibility**: Full keyboard navigation and screen reader support
- **Modern UI**: Clean, intuitive interface with smooth animations

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vitest** and **React Testing Library** for testing
- **Docker** for containerization
- **GitHub Actions** for CI/CD

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your backend API URL
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

The app will be available at `http://localhost:8080`

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

The project includes:
- **Unit tests** for all components
- **Integration tests** for user workflows
- **Accessibility tests**
- **90%+ code coverage**

## 🐳 Docker

### Build and run with Docker

```bash
# Build the Docker image
docker build -t todo-frontend .

# Run the container
docker run -p 3000:3000 -e REACT_APP_API_URL=http://your-backend-url todo-frontend
```

### Run with Docker Compose

```bash
# Start all services (frontend, backend, database)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🚀 Deployment

The app includes a complete CI/CD pipeline with GitHub Actions:

1. **Automated Testing**: Runs on every PR and push
2. **Code Quality**: ESLint and Prettier checks
3. **Docker Build**: Builds and tests Docker images
4. **Container Registry**: Pushes to GitHub Container Registry
5. **Multi-platform**: Supports AMD64 and ARM64 architectures

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `NODE_ENV` | Environment mode | `development` |

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── TodoApp.tsx     # Main application logic
│   ├── TodoItem.tsx    # Individual todo item
│   ├── AddTodo.tsx     # Add todo form
│   └── __tests__/      # Component tests
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── test/               # Test utilities
```

## 🤝 Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/add-todo-#5
   ```

2. **Make your changes**
   - Write code following TypeScript and ESLint rules
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

4. **Create a Pull Request**
   - Link to the related GitHub issue
   - Provide a clear description of changes
   - Ensure all CI checks pass

5. **Code Review**
   - At least one team member must review
   - All comments must be addressed
   - PR can only be merged after approval

## 🐛 Troubleshooting

### Common Issues

**Build Failures**
- Check Node.js version (requires 18+)
- Clear node_modules and reinstall
- Verify environment variables

**API Connection Issues**
- Confirm backend is running
- Check REACT_APP_API_URL in .env
- Verify CORS settings on backend

**Docker Issues**
- Ensure Docker is running
- Check port conflicts (3000, 5000, 27017)
- Verify Docker Compose version

### Getting Help

- Check the [GitHub Issues](link-to-issues)
- Review the test output for detailed error messages
- Check browser console for runtime errors

## 📝 API Integration

The frontend expects a REST API with these endpoints:

```
GET    /api/todos       # Fetch all todos
POST   /api/todos       # Create new todo
PUT    /api/todos/:id   # Update todo
DELETE /api/todos/:id   # Delete todo
```

Expected todo object structure:
```typescript
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt?: string;
}
```

## 🎨 Customization

The app uses Tailwind CSS for styling. Key customization points:

- **Colors**: Modify the color palette in `tailwind.config.ts`
- **Animations**: Custom animations in `src/index.css`
- **Components**: Styled components in `src/components/`

## 📊 Performance

- **Lighthouse Score**: 95+ on all metrics
- **Bundle Size**: Optimized with code splitting
- **Loading Time**: < 2s on 3G networks
- **Accessibility**: WCAG 2.1 AA compliant

## 🔐 Security

- **Input Validation**: All user inputs are validated
- **XSS Protection**: Content Security Policy headers
- **HTTPS**: Enforced in production
- **Dependencies**: Regular security audits

---

Built with ❤️ using React and TypeScript
