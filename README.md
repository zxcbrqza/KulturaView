# KulturaView - Beauty Visualization & Booking System

![KulturaView Logo](https://via.placeholder.com/800x200/568203/FFFFFF?text=KulturaView+-+Beauty+Visualization+System)

A comprehensive web-based beauty visualization and appointment booking system for **Kultura Spa** in Pamporovo, Bulgaria. This system allows users to upload facial images, visualize selected beauty treatments using AI-powered computer vision, and book appointments seamlessly.

## 🌟 Features

### 👥 Client-Side Features
- **🏠 Home & Info Pages**: Spa description, services showcase, and updates
- **🎨 Beauty Visualization**: Upload photos, select procedures, adjust enhancement levels
- **📥 Image Download**: Secure download of processed images with watermarks
- **🛡️ Image Validation**: Filters inappropriate, NSFW, or AI-generated content
- **📅 Appointment Booking**: Book, reschedule, or cancel spa services
- **👤 Account Management**: User registration, profile editing, appointment history
- **⭐ Reviews & Feedback**: Post-visit reviews and ratings system
- **📱 Responsive Design**: Mobile-first, accessible interface

### 🔧 Admin-Side Features
- **👥 Client Management**: Add, view, edit, disable/ban client profiles
- **💅 Services Management**: CRUD operations for treatments and pricing
- **📅 Appointment Management**: Approve, reschedule, cancel bookings
- **🔍 System Monitoring**: Image misuse detection, security audit logs
- **📝 Content Management**: Homepage info, announcements, service categories
- **💬 Feedback Management**: View and respond to user reviews
- **🔐 Role-Based Access**: Secure admin/staff authentication system

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React 18 + TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL |
| **Authentication** | JWT (JSON Web Tokens) |
| **Image Processing** | Sharp (ready for OpenCV integration) |
| **File Upload** | Multer |
| **Validation** | Joi |
| **Styling** | Tailwind CSS with custom avocado theme |
| **Icons** | Lucide React |

## 🎨 Design Theme

- **Primary Color**: Avocado Green (#568203)
- **Secondary Colors**: White (#FFFFFF), Neutral Gray
- **Typography**: Inter, Poppins, Roboto (sans-serif)
- **Style**: Minimalistic, clean, modern
- **Accessibility**: WCAG 2.1 compliant

## 📁 Project Structure

```
KulturaView/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth, etc.)
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions (API, etc.)
│   │   └── index.tsx       # App entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API route handlers
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   ├── uploads/            # Image upload directory
│   └── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/zxcbrqza/KulturaView
cd kulturaview
```

### 2. Backend Setup

```bash
cd server
npm install
```

#### Environment Variables

Create a `.env` file in the `server` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=kulturaview

# Server Configuration
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here

# Optional: Production settings
NODE_ENV=development
```

#### Database Setup

1. **Create MySQL Database:**
```sql
CREATE DATABASE kulturaview;
```

2. **Start the Server** (tables will be created automatically):
```bash
npm run dev
```

The server will automatically create all necessary tables on first run.

### 3. Frontend Setup

```bash
cd ../client
npm install
```

#### Environment Variables

Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### Start the Frontend

```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🗄️ Database Schema

### Tables Created Automatically:

- **users**: User accounts and profiles
- **services**: Beauty services and treatments
- **appointments**: Booking records
- **image_processes**: Image processing history
- **reviews**: User feedback and ratings

## 🔐 Authentication

### User Roles:
- **client**: Regular users (default)
- **staff**: Spa staff members
- **admin**: Full system access

### API Authentication:
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (Admin)
- `PUT /api/services/:id` - Update service (Admin)
- `DELETE /api/services/:id` - Delete service (Admin)

### Appointments
- `GET /api/appointments/my` - Get user appointments
- `GET /api/appointments/all` - Get all appointments (Admin)
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id/status` - Update status (Admin)
- `PUT /api/appointments/:id/cancel` - Cancel appointment

### Image Processing
- `POST /api/image/process` - Process image
- `GET /api/image/file/:filename` - Serve image file
- `GET /api/image/history` - Get processing history

### Reviews
- `GET /api/reviews/service/:serviceId` - Get service reviews
- `GET /api/reviews/all` - Get all reviews (Admin)
- `POST /api/reviews` - Create review
- `GET /api/reviews/my` - Get user reviews

## 🖼️ Image Processing

### Supported Procedures:
- **Lip Enhancement** (`lip_fillers`)
- **Eye Brightening** (`eye_brightening`)
- **Skin Smoothing** (`skin_smoothing`)

### Image Requirements:
- **Format**: JPG, PNG, GIF
- **Size**: Maximum 5MB
- **Type**: Front-facing photos work best

### Security Features:
- Automatic watermarking
- Secure file storage
- Image validation
- Automatic cleanup (24-hour retention)

## 🚀 Deployment

### Production Environment Variables

#### Server (.env):
```env
NODE_ENV=production
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=kulturaview_prod
JWT_SECRET=your_super_secure_production_jwt_secret
PORT=5000
```

#### Client (.env.production):
```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

### Build Commands

#### Backend:
```bash
cd server
npm install --production
npm start
```

#### Frontend:
```bash
cd client
npm run build
# Serve the build folder with a static server
```

### Recommended Deployment Platforms:
- **Backend**: Heroku, DigitalOcean, AWS EC2
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: AWS RDS, DigitalOcean Managed Database

## 🧪 Testing

### Backend Testing:
```bash
cd server
npm test
```

### Frontend Testing:
```bash
cd client
npm test
```

### API Testing:
Use tools like **Postman** or **Insomnia** with the provided API endpoints.

## 🔧 Development

### Adding New Features:

1. **Backend**: Add routes in `server/src/routes/`
2. **Frontend**: Add components in `client/src/components/`
3. **Database**: Modify schema in `server/src/config/database.js`

### Code Style:
- **ESLint** and **Prettier** configured
- **TypeScript** for type safety
- **Conventional Commits** recommended

## 🐛 Troubleshooting

### Common Issues:

#### Database Connection Error:
```bash
Error: ER_ACCESS_DENIED_ERROR: Access denied for user
```
**Solution**: Check MySQL credentials in `.env` file

#### Port Already in Use:
```bash
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in `.env` or kill the process using the port

#### Image Upload Fails:
**Solution**: Ensure `uploads/` directory exists and has write permissions

#### CORS Errors:
**Solution**: Verify `REACT_APP_API_URL` matches your backend URL

## 📝 Usage Guide

### For Clients:

1. **Register/Login** at `/register` or `/login`
2. **Browse Services** at `/services`
3. **Try Virtual Visualization** at `/virtual-try-on`
4. **Book Appointments** through service pages
5. **Manage Profile** at `/profile`

### For Admins:

1. **Login** with admin credentials
2. **Access Admin Panel** at `/admin`
3. **Manage Services** - Add/edit/delete treatments
4. **Handle Appointments** - Approve/reschedule bookings
5. **Monitor System** - View logs and user activity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines:
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Email**: support@kulturaview.com
- **Documentation**: [Wiki](https://github.com/your-username/kulturaview/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/kulturaview/issues)

## 🙏 Acknowledgments

- **Kultura Spa** - Pamporovo, Bulgaria
- **OpenCV Community** - Computer vision libraries
- **React Community** - Frontend framework
- **Tailwind CSS** - Styling framework

---

**Made with ❤️ for Kultura Spa by the KulturaView Team**

---

## 📊 Project Status

- ✅ **Core Features**: Complete
- ✅ **Authentication**: Implemented
- ✅ **Image Processing**: Basic implementation
- 🔄 **Advanced CV**: In development
- 🔄 **Payment Integration**: Planned
- 🔄 **Mobile App**: Future release

## 🔮 Roadmap

### Version 2.0 (Planned)
- [ ] Advanced deepfake detection
- [ ] Real-time video processing
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Mobile application
- [ ] Advanced analytics dashboard

### Version 1.1 (Next Release)
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Social media integration
- [ ] Advanced image filters
- [ ] Appointment conflicts handling

---

**Last Updated**: December 2024
**Version**: 1.0.0
