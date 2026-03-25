<template>
 <div class="min-h-screen bg-[#f8f9fb]">
 <!-- Desktop Sidebar -->
 <aside class="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 min-h-screen fixed left-0 top-0 z-50">
 <!-- Logo -->
 <div class="p-6 pb-8 flex items-center gap-3">
 <div class="w-10 h-10 bg-gradient-to-br from-[#065fdb] to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#065fdb]/20">
 E
 </div>
 <div class="flex flex-col">
 <span class="text-lg font-bold text-gray-900 tracking-tight leading-none">Errandr</span>
 <span class="text-[10px] font-semibold text-[#065fdb] tracking-wide leading-none mt-0.5">Rider Portal</span>
 </div>
 </div>

 <!-- Rider Profile Card -->
 <div class="px-4 mb-6">
 <div class="p-4 rounded-2xl bg-gray-50 border border-gray-100 transition-all hover:bg-white hover:shadow-md">
 <div class="flex items-center gap-3">
 <div class="relative">
 <div class="w-11 h-11 rounded-xl bg-[#065fdb] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#065fdb]/20">
 {{ userInitials }}
 </div>
 <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border border-white" />
 </div>
 <div class="flex-1 min-w-0">
 <h3 class="font-bold text-gray-900 text-sm truncate">{{ userDisplayName }}</h3>
 <span class="text-[10px] font-medium text-emerald-600">Online</span>
 </div>
 </div>
 </div>
 </div>
 
 <!-- Navigation -->
 <nav class="flex-1 px-4 space-y-1">
 <p class="text-[10px] font-semibold text-gray-400 tracking-wider mb-3 px-3">Menu</p>
 <NuxtLink
 v-for="item in navItems"
 :key="item.path"
 :to="item.path"
 class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all group"
 :class="isActive(item.path) 
 ? 'bg-[#065fdb] text-white shadow-md shadow-[#065fdb]/20' 
 : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'"
 >
 <component :is="item.icon" class="w-[18px] h-[18px] mr-3 transition-transform group-hover:scale-110" />
 {{ item.label }}
 </NuxtLink>
 </nav>

 <!-- Logout -->
 <div class="p-4 border-t border-gray-100">
 <button
 @click="handleLogoutClick"
 class="flex items-center w-full px-4 py-3 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-all group"
 >
 <LogOut class="w-[18px] h-[18px] mr-3 transition-transform group-hover:-translate-x-0.5" />
 Log Out
 </button>
 </div>
 </aside>

 <!-- In-App Toast Mount -->
 <InAppToast ref="toastRef" />

 <!-- Mobile Header -->
 <header class="lg:hidden bg-white border-b border-gray-100 sticky top-0 z-40 px-5 py-3.5 flex items-center justify-between">
 <div class="flex items-center gap-2.5">
 <div class="w-9 h-9 bg-gradient-to-br from-[#065fdb] to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#065fdb]/10">
 E
 </div>
 <span class="text-lg font-bold text-gray-900 tracking-tight">Errandr</span>
 </div>
 <div class="flex items-center gap-2">
 <NuxtLink to="/notifications" class="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 transition-all">
 <Bell class="w-5 h-5" />
 <div v-if="unreadCount > 0" class="absolute top-2 right-2 w-4 h-4 bg-[#065fdb] border border-white rounded-full flex items-center justify-center">
 <span class="text-[8px] font-bold text-white">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
 </div>
 </NuxtLink>
 <button
 @click="showMobileMenu = !showMobileMenu"
 class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 active:scale-95 transition-all"
 >
 <Menu class="w-5 h-5" />
 </button>
 </div>
 </header>

 <!-- Mobile Overlay -->
 <Transition name="overlay">
 <div v-if="showMobileMenu" class="lg:hidden fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" @click="showMobileMenu = false" />
 </Transition>

 <!-- Mobile Sidebar -->
 <Transition name="slide">
 <aside v-if="showMobileMenu" class="lg:hidden w-72 bg-white min-h-screen fixed left-0 top-0 z-50 shadow-2xl flex flex-col">
 <div class="p-5 border-b border-gray-100 flex items-center justify-between">
 <div class="flex items-center gap-2.5">
 <div class="w-9 h-9 bg-[#065fdb] rounded-lg flex items-center justify-center text-white font-bold text-sm">E</div>
 <span class="text-lg font-bold text-gray-900 tracking-tight">Errandr</span>
 </div>
 <button @click="showMobileMenu = false" class="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400"><X class="w-5 h-5" /></button>
 </div>

 <div class="p-5 bg-gray-50 border-b border-gray-100">
 <div class="flex items-center gap-4">
 <div class="w-12 h-12 rounded-xl bg-[#065fdb] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-[#065fdb]/20">
 {{ userInitials }}
 </div>
 <div class="min-w-0">
 <h3 class="font-bold text-gray-900 text-base tracking-tight truncate">{{ userDisplayName }}</h3>
 <p class="text-xs text-gray-400 truncate">{{ user?.email }}</p>
 </div>
 </div>
 </div>
 
 <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
 <NuxtLink
 v-for="item in navItems"
 :key="item.path"
 :to="item.path"
 class="flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all"
 :class="isActive(item.path) ? 'bg-[#065fdb] text-white shadow-md shadow-[#065fdb]/20' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'"
 @click="showMobileMenu = false"
 >
 <component :is="item.icon" class="w-[18px] h-[18px] mr-3" />
 {{ item.label }}
 </NuxtLink>
 </nav>

 <div class="p-5 border-t border-gray-100">
 <button @click="handleLogoutClick" class="flex items-center w-full px-4 py-3.5 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
 <LogOut class="w-[18px] h-[18px] mr-3" /> Log Out
 </button>
 </div>
 </aside>
 </Transition>

 <!-- Main Content -->
 <main class="flex-1 lg:ml-64 flex flex-col min-h-screen">
 <!-- Desktop Header -->
 <header class="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-30 px-8 py-5 hidden lg:flex items-center justify-between">
 <div>
 <h1 class="text-xl font-bold text-gray-900 tracking-tight leading-none">{{ pageTitle }}</h1>
 <p class="text-xs text-gray-400 font-medium mt-1">{{ pageDescription }}</p>
 </div>
 
 <div class="flex items-center gap-4">
 <NuxtLink to="/notifications" class="relative group">
 <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:shadow-md group-hover:text-[#065fdb] transition-all border border-transparent group-hover:border-gray-100">
 <Bell class="w-[18px] h-[18px]" />
 </div>
 <div v-if="unreadCount > 0" class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#065fdb] border border-white rounded-full flex items-center justify-center shadow-sm">
 <span class="text-[8px] font-bold text-white">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
 </div>
 </NuxtLink>

 <div class="w-px h-8 bg-gray-100" />
 
 <div class="flex items-center gap-3">
 <div class="text-right">
 <p class="text-sm font-semibold text-gray-900 leading-none mb-0.5">{{ userDisplayName }}</p>
 <p class="text-[10px] font-medium text-gray-400">Rider</p>
 </div>
 <div class="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white text-sm font-bold shadow-md">
 {{ userInitials }}
 </div>
 </div>
 </div>
 </header>

 <!-- Page Content -->
 <div class="flex-1 p-5 md:p-8">
 <slot />
 </div>
 
 <!-- Footer -->
 <footer class="px-8 py-5 border-t border-gray-100 flex items-center justify-between">
 <p class="text-xs text-gray-400 font-medium">© {{ new Date().getFullYear() }} Errandr</p>
 <div class="flex items-center gap-5">
 <a href="#" class="text-xs text-gray-400 hover:text-[#065fdb] font-medium transition-colors">Terms</a>
 <a href="#" class="text-xs text-gray-400 hover:text-[#065fdb] font-medium transition-colors">Support</a>
 </div>
 </footer>
 </main>

 <!-- Logout Confirmation Modal -->
 <Transition name="fade">
 <div v-if="logoutModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm px-6" @click.self="logoutModalOpen = false">
 <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 flex flex-col items-center text-center space-y-6 animate-scale-in">
 <div class="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100">
 <LogOut class="w-8 h-8 text-rose-500" />
 </div>

 <div class="space-y-2">
 <h3 class="text-xl font-bold text-gray-900 tracking-tight">Log Out?</h3>
 <p class="text-sm text-gray-500">
 Are you sure you want to log out of your account?
 </p>
 </div>

 <div class="flex flex-col gap-2.5 w-full">
 <button @click="confirmLogout" class="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-500/20 transition-all active:scale-[0.98]">
 Yes, Log Out
 </button>
 <button @click="logoutModalOpen = false" class="w-full py-3.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all">
 Cancel
 </button>
 </div>
 </div>
 </div>
 </Transition>

 <!-- Chat Widget -->
 <div class="fixed bottom-6 right-6 z-[99]">
 <ChatWidget />
 </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useUser } from '@/composables/modules/auth/user'
import { useRouter, useRoute } from 'vue-router'
import ChatWidget from '@/components/ChatWidget.vue'
import { 
 LayoutDashboard, 
 Bike, 
 Wallet, 
 User, 
 LogOut, 
 Menu, 
 X,
 ChevronRight,
 Bell
} from 'lucide-vue-next'
import { useRealtimeNotifications } from '@/composables/core/useRealtimeNotifications'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'
import InAppToast from '@/components/InAppToast.vue'

const { toastQueue } = useRealtimeNotifications()
const { unreadCount } = useNotifications()
const toastRef = ref<any>(null)

// Watch toastQueue to push to component
watch(() => toastQueue.value.length, (newLen, oldLen) => {
 if (newLen > oldLen) {
 // Process all new items added since last watch trigger
 const newItems = toastQueue.value.slice(oldLen, newLen)
 newItems.forEach(item => {
 if (toastRef.value) {
 toastRef.value.addToast(item)
 }
 })
 }
})


const route = useRoute()
const router = useRouter()
const { user, logOut } = useUser()
const showMobileMenu = ref(false)
const logoutModalOpen = ref(false)

const navItems = [
 { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
 { path: '/deliveries', label: 'My Deliveries', icon: Bike },
 { path: '/earnings', label: 'Earnings', icon: Wallet },
 { path: '/notifications', label: 'Notifications', icon: Bell },
 { path: '/profile', label: 'Profile', icon: User }
]

const pageTitles: Record<string, { title: string; description: string }> = {
 '/dashboard': { title: 'Dashboard', description: 'Your delivery overview at a glance.' },
 '/deliveries': { title: 'My Deliveries', description: 'Track and manage your active and past deliveries.' },
 '/earnings': { title: 'Earnings', description: 'View your earnings, tips, and payout history.' },
 '/notifications': { title: 'Notifications', description: 'Real-time updates and new delivery opportunities.' },
 '/profile': { title: 'Profile', description: 'Manage your personal information and settings.' }
}

const pageTitle = computed(() => pageTitles[route.path]?.title || 'Dashboard')
const pageDescription = computed(() => pageTitles[route.path]?.description || 'Welcome back!')

const userDisplayName = computed(() => {
 if (!user.value) return 'Rider'
 return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim() || user.value.email || 'Rider'
})

const userInitials = computed(() => {
 if (!user.value) return 'R'
 const first = user.value.firstName || ''
 const last = user.value.lastName || ''
 return (first[0] || last[0] || user.value.email?.[0] || 'R').toUpperCase()
})

const handleLogoutClick = () => {
 logoutModalOpen.value = true
}

const isActive = (path: string) => route.path === path || route.path.startsWith(path + '/')

const confirmLogout = () => {
 logOut()
}

watch(() => route.path, () => showMobileMenu.value = false)
</script>

<style scoped>
.overlay-enter-active, .overlay-leave-active { transition: opacity 0.3s ease; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-scale-in {
 animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleIn {
 from { opacity: 0; transform: scale(0.95) translateY(8px); }
 to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
