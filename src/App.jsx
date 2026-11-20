import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Article from './pages/Article'
import BudgetFinder from './pages/BudgetFinder'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProductDetail from './pages/ProductDetail'
import RoutineBuilder from './pages/RoutineBuilder'
import SkinFacts from './pages/SkinFacts'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="skinfacts" element={<SkinFacts />} />
        <Route path="skinfacts/:productId" element={<ProductDetail />} />
        <Route path="routine" element={<RoutineBuilder />} />
        <Route path="budget" element={<BudgetFinder />} />
        <Route path="learn/:slug" element={<Article />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
