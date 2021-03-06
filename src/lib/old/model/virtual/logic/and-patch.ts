import { NodeModel } from "../../common-node"

export class AndPatch extends NodeModel {
  constructor(id, type, address, operation, label, position, inputs, outputs) {
    super(id, type, address, operation, label, position, inputs, outputs)
  }

  handle(nodes) {
    const ret = []
    const indent = "        "
    let comment = indent + "// AndPatch\n"
    ret.push(comment)

    let index = -1
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === this.id) {
        index = i
      }
    }

    let variantName = "node" + index

    let prev = this.inputs[0]

    switch (prev.type) {
      case "ref":
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id === prev.refId) {
            let sourceOutputs = nodes[i].outputs
            for (let j = 0; j < sourceOutputs.length; j++) {
              if (sourceOutputs[j].port === prev.refOutputPort) {
                let code =
                  indent +
                  variantName +
                  ".inputs[0] = node" +
                  i +
                  ".outputs[" +
                  j +
                  "];"
                ret.push(code)
              }
            }
          }
        }
        break
      default:
        throw "ERROR"
    }

    let post = this.inputs[1]

    switch (post.type) {
      case "ref":
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id === post.refId) {
            let sourceOutputs = nodes[i].outputs
            for (let j = 0; j < sourceOutputs.length; j++) {
              if (sourceOutputs[j].port === post.refOutputPort) {
                let code =
                  indent +
                  variantName +
                  ".inputs[1] = node" +
                  i +
                  ".outputs[" +
                  j +
                  "];"
                ret.push(code)
              }
            }
          }
        }
        break
      default:
        throw "ERROR"
    }

    let code =
      indent +
      variantName +
      ".outputs[0] = " +
      variantName +
      ".inputs[0] & " +
      variantName +
      ".inputs[1];\n"

    ret.push(code)

    return ret.join("")
  }
}
