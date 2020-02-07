import Sortable from "sortablejs"
let sortable
const SortableTable = {
    bind(el, binding, vnode) {
        let sortableElement = el.getElementsByTagName("tbody")[0]
        const options = {
            handle: ".sortHandle",
            animation: 150,
            onUpdate: function (event) {
                vnode.child.$emit("sorted", event)
            }
        }

        sortable = Sortable.create(sortableElement, options)
    },
}
export default SortableTable
