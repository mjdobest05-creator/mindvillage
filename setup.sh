#!/bin/bash

echo "🚀 MindVillage 초기화 시작..."

# 폴더 생성
mkdir -p src/{components,screens,stores,database,services,hooks,types,utils}
mkdir -p src/components/{UI,Modals,3D}

# 패키지 설치
npm install zustand firebase react-native-reanimated three @react-three/fiber @react-three/drei expo-file-system expo-document-picker

# .env 생성
cp .env.example .env

echo "✅ 초기화 완료!"
echo "다음 단계: npm run build"
