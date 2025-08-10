import { createRouter, createWebHistory } from 'vue-router'
import Factions from '../views/Factions.vue'
import Faction from '../views/Faction.vue'
import Squad from '../views/Squad.vue'

const routes = [
    {
        path: '/factions',
        name: 'factions',
        component: Factions
    },
    {
        path: '/faction',
        name: 'faction',
        component: Faction
    },
    {
        path: '/squad',
        name: 'squad',
        component: Squad
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})
export default router