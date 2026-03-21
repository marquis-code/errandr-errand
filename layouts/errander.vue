<template>
  <FullScreenLoader />
  <div class="min-h-screen bg-gray-50">
    <!-- Desktop Sidebar -->
    <aside class="hidden lg:block w-64 bg-white border-r-[0.5px] border-gray-50 min-h-screen fixed left-0 top-0 shadow-sm">
      <!-- Logo -->
      <div class="p-4 border-b border-gray-100 flex items-center gap-3">
        <div class="w-10 h-10 bg-parentPrimary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
          E
        </div>
        <span class="text-xl font-black text-parentPrimary tracking-tighter">Errandr</span>
      </div>
      
      <!-- Navigation -->
      <nav class="p-4 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all group"
          :class="isActive(item.path) 
            ? 'bg-parentPrimary text-white shadow-sm' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-parentPrimary'"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Logout Button -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
        <button
          @click="handleLogoutClick"
          class="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut class="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Mobile Header -->
    <header class="lg:hidden bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-parentPrimary rounded-lg flex items-center justify-center text-white font-bold text-lg">
            E
          </div>
          <span class="font-black text-parentPrimary tracking-tighter">Errandr</span>
        </div>
        <button
          @click="showMobileMenu = !showMobileMenu"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu class="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </header>

    <!-- Mobile Menu Overlay -->
    <Transition name="overlay">
      <div
        v-if="showMobileMenu"
        class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
        @click="showMobileMenu = false"
      ></div>
    </Transition>

    <!-- Mobile Sidebar -->
    <Transition name="slide">
      <aside
        v-if="showMobileMenu"
        class="lg:hidden w-72 bg-white min-h-screen fixed left-0 top-0 z-50 shadow-2xl"
      >
        <!-- Mobile Header -->
        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-parentPrimary rounded-lg flex items-center justify-center text-white font-bold text-lg">
              E
            </div>
            <span class="font-black text-parentPrimary tracking-tighter">Errandr</span>
          </div>
          <button
            @click="showMobileMenu = false"
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X class="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <!-- User Info -->
        <div class="p-4 bg-gradient-to-br from-parentPrimary/5 to-parentPrimary/10 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-parentPrimary text-white flex items-center justify-center font-semibold text-lg">
              {{ userInitials }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 truncate">{{ userDisplayName }}</h3>
              <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
            </div>
          </div>
        </div>
        
        <!-- Mobile Navigation -->
        <nav class="p-4 space-y-1 max-h-[calc(100vh-240px)] overflow-y-auto">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all"
            :class="isActive(item.path) 
              ? 'bg-parentPrimary text-white shadow-sm' 
              : 'text-gray-700 hover:bg-gray-50 hover:text-parentPrimary'"
            @click="showMobileMenu = false"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3 flex-shrink-0" />
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Mobile Logout -->
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
          <button
            @click="handleLogoutClick"
            class="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut class="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>
    </Transition>

    <!-- Main Content -->
    <main class="flex-1 lg:ml-64">
      <!-- Dashboard Header -->
      <div class="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm hidden lg:block">
        <div class="px-6 py-1.5">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl font-bold text-gray-900">{{ pageTitle }}</h1>
              <p class="text-sm text-gray-500">{{ pageDescription }}</p>
            </div>
            <div class="flex items-center gap-3">
              <!-- User Profile -->
              <div class="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl">
                <div class="w-10 h-10 rounded-full bg-parentPrimary text-white flex items-center justify-center font-semibold">
                  {{ userInitials }}
                </div>
                <div class="text-left">
                  <p class="text-sm font-semibold text-gray-900">{{ userDisplayName }}</p>
                  <p class="text-xs text-gray-500">{{ user?.email }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <div class="bg-white p-6">
        <slot />
      </div>
    </main>

     <Transition
  enter-active-class="transition ease-out duration-300"
  enter-from-class="opacity-0"
  enter-to-class="opacity-100"
  leave-active-class="transition ease-in duration-200"
  leave-from-class="opacity-100"
  leave-to-class="opacity-0"
>
  <div
    v-if="logoutModalOpen"
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
    @click.self="logoutModalOpen = false"
  >
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="logoutModalOpen"
        class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-7 flex flex-col items-center text-center space-y-5"
      >
        <!-- Icon -->
        <div class="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
          <LogOut class="w-7 h-7 text-rose-500" />
        </div>

        <!-- Content -->
        <div class="space-y-1">
          <h3 class="text-xl font-semibold text-gray-900">
            Leaving already?
          </h3>
          <p class="text-sm text-gray-600 leading-relaxed">
            You’ll be signed out of your account.  
            Don’t worry — your data will be waiting for you ✨
          </p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 w-full pt-2">
          <button
            @click="logoutModalOpen = false"
            class="w-full px-4 py-3 rounded-full text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Stay logged in
          </button>

          <button
            @click="confirmLogout"
            class="w-full px-4 py-3 rounded-full text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </Transition>
  </div>
</Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useUser } from '@/composables/modules/auth/user'
import { useRouter, useRoute } from 'vue-router'
import { 
  LayoutDashboard, 
  Bike, 
  Wallet, 
  User, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { user, logOut } = useUser()
const showMobileMenu = ref(false)
const logoutModalOpen = ref(false)

const navItems = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/deliveries', label: 'Deliveries', icon: Bike },
  { path: '/earnings', label: 'Earnings', icon: Wallet },
  { path: '/profile', label: 'My Profile', icon: User }
]

const pageTitles: Record<string, { title: string; description: string }> = {
  '/dashboard': { title: 'Errander Overview', description: 'Your delivery activity at a glance' },
  '/deliveries': { title: 'Deliveries', description: 'Monitor and track your active deliveries' },
  '/earnings': { title: 'Earnings', description: 'View your payouts and transaction history' },
  '/profile': { title: 'My Profile', description: 'Manage your courier account details' }
}

const pageTitle = computed(() => pageTitles[route.path]?.title || 'Courier Dashboard')
const pageDescription = computed(() => pageTitles[route.path]?.description || 'Welcome back to Errandr')

const userDisplayName = computed(() => {
  if (!user.value) return 'Errander'
  return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim() || user.value.email || 'Errander'
})

const userInitials = computed(() => {
  if (!user.value) return 'E'
  const first = user.value.firstName || ''
  const last = user.value.lastName || ''
  return (first[0] || last[0] || user.value.email?.[0] || 'E').toUpperCase()
})

const handleLogoutClick = () => {
  logoutModalOpen.value = true
}

const isActive = (path: string) => route.path === path

const confirmLogout = () => {
  if (process.client) {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    logoutModalOpen.value = false
    window.location.reload()
  }
}

watch(() => route.path, () => showMobileMenu.value = false)
</script>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.25s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.25s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
