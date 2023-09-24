import { getFilteredData, getByID, getInsights } from "./controller"  
import { router } from '@core/router'

const route = router()

route.post('/', getFilteredData)
route.get("/:id", getByID)
route.post('/insights', getInsights)
export default route