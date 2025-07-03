# FreelanceDAO 🚀

A decentralized freelance marketplace built on Ethereum blockchain that connects freelancers with clients through smart contracts, featuring escrow services, reputation tracking, and decentralized dispute resolution.

## 🌟 Features

### Core Functionality
- **Smart Contract-Based Project Management**: Create, accept, and manage freelance projects on the blockchain
- **Escrow System**: Secure payment handling with automatic fund release upon project completion
- **Reputation Tracking**: Build and maintain reputation scores for both freelancers and clients
- **Decentralized Dispute Resolution**: Community voting system for resolving project disputes
- **User Profiles**: Customizable profiles with bio, avatar, and reputation display

### Technical Features
- **MetaMask Integration**: Seamless wallet connection for Ethereum transactions
- **Real-time Updates**: Live project status updates and transaction confirmations
- **Responsive Design**: Modern, mobile-friendly interface
- **Gas Optimization**: Efficient smart contract design for cost-effective transactions

## 🏗️ Architecture

### Smart Contracts
- **FreelanceDAO.sol**: Main contract handling project lifecycle, payments, and dispute resolution
- **UserProfile.sol**: User profile management and reputation tracking
- **Escrow.sol**: Secure payment escrow system (in development)

### Frontend
- **React.js**: Modern UI framework with hooks and context
- **Ethers.js**: Ethereum blockchain interaction
- **React Router**: Client-side routing
- **React Modal**: Interactive project details and forms

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MetaMask browser extension
- Ethereum testnet (Sepolia/Goerli) or local Hardhat network

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/freelanceDAO.git
   cd freelanceDAO
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Deploy smart contracts**
   ```bash
   cd ../backend
   npx hardhat compile
   npx hardhat node
   # In a new terminal
   npx hardhat run scripts/deploy.js --network localhost
   ```

5. **Update contract addresses**
   - Copy the deployed contract addresses from the deployment output
   - Update `frontend/src/contractAddresses.js` with the new addresses

6. **Start the frontend**
   ```bash
   cd ../frontend
   npm start
   ```

The application will be available at `http://localhost:3000`

## 📖 Usage Guide

### For Freelancers
1. **Connect Wallet**: Use MetaMask to connect your Ethereum wallet
2. **Create Profile**: Set up your profile with name, bio, and avatar
3. **Create Projects**: List your services with descriptions and pricing
4. **Manage Projects**: Track project status and mark completed work
5. **Receive Payments**: Get paid automatically upon client confirmation

### For Clients
1. **Connect Wallet**: Use MetaMask to connect your Ethereum wallet
2. **Browse Projects**: View available freelance services
3. **Accept Projects**: Purchase projects by sending ETH to escrow
4. **Confirm Completion**: Approve completed work to release payment
5. **Raise Disputes**: Use dispute resolution if issues arise

### Project Lifecycle
1. **Creation**: Freelancer creates project with details and price
2. **Acceptance**: Client accepts and pays into escrow
3. **Development**: Freelancer works on the project
4. **Completion**: Freelancer marks project as complete
5. **Confirmation**: Client confirms and payment is released
6. **Dispute Resolution**: Community voting if disputes arise

## 🔧 Development

### Smart Contract Development
```bash
cd backend
npx hardhat test          # Run tests
npx hardhat coverage      # Test coverage
npx hardhat node          # Local blockchain
```

### Frontend Development
```bash
cd frontend
npm start                 # Development server
npm test                  # Run tests
npm run build            # Production build
```

### Environment Variables
Create `.env` files in both `backend/` and `frontend/` directories:
```env
# Backend
PRIVATE_KEY=your_private_key
INFURA_URL=your_infura_url

# Frontend
REACT_APP_CONTRACT_ADDRESS=deployed_contract_address
REACT_APP_NETWORK_ID=network_id
```

## 🛡️ Security Features

- **Escrow Protection**: Funds held in smart contract until project completion
- **Dispute Resolution**: Decentralized voting system for conflict resolution
- **Reputation System**: Transparent reputation tracking to prevent fraud
- **Deadline Enforcement**: Automatic project deadlines with penalty mechanisms

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with intuitive navigation
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Live transaction status and project updates
- **Interactive Elements**: Smooth animations and user feedback
- **Accessibility**: WCAG compliant design for inclusive user experience

## 📊 Smart Contract Functions

### Project Management
- `createProject(name, description, amount)`: Create new freelance project
- `acceptTerms(projectId)`: Accept and pay for project
- `markAsCompleted(projectId)`: Mark project as finished
- `confirmCompletion(projectId)`: Confirm completion and release payment

### Dispute Resolution
- `raiseDispute(projectId)`: Initiate dispute resolution
- `voteOnDispute(projectId, voteForFreelancer)`: Vote on dispute outcome
- `resolveDispute(projectId, voteForFreelancer)`: Execute dispute resolution

### Profile Management
- `createOrUpdateProfile(name, bio, avatar)`: Update user profile
- `getProfile(user)`: Retrieve user profile information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the inline code comments and component documentation
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join community discussions in GitHub Discussions

## 🔮 Roadmap

- [ ] Advanced reputation algorithms
- [ ] Multi-token support (ERC-20 tokens)
- [ ] Automated milestone payments
- [ ] Integration with IPFS for file storage
- [ ] Mobile app development
- [ ] Advanced dispute resolution with DAO governance
- [ ] Cross-chain compatibility

## 🙏 Acknowledgments

- Ethereum Foundation for blockchain infrastructure
- OpenZeppelin for secure smart contract libraries
- MetaMask team for wallet integration
- React community for frontend framework

---

**Built with ❤️ for the decentralized future of work**