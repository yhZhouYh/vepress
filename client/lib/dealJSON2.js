/**
 * 文件说明:处理地址json转换成jquery地址插件所需的数据，注意插件里省一级为86，注意修改成10000
 * 详细描述:
 * 创建者:   周运徽
 * 创建时间: 2018/1/8
 * 变更记录:
 */
var area = require('./area.json')
var fs = require('fs')

var data = area.data
var address = {}
var length = area.data.length

// 
address['10000'] = {}
data.map((item, index) => {
  address['10000'][item.id] = item.name
  loop(item)
})

function addToAddress(arr, obj) {
  arr.map((item, index) => {
    obj[item.id] = item.name
    loop(item)  
  })
}
function loop(obj) {
  if (obj.children && obj.children.length) {
    address[obj['id']] = {}
    addToAddress(obj.children, address[obj['id']])
  }
}
// console.log(address)

fs.writeFileSync('./list.json', JSON.stringify(address))