// import * as TWEEN from './tweenjs/dist/tween.umd.js'

export default (el, from, controls, duration, changeFocus=false) => {


if(Object.keys(el).length > 0){  
    let t =  new TWEEN.Tween(from)
    const isSun = () => {return !Object.keys(el).includes('mesh')}

    t.to(isSun() ? {z: 25} : el.mesh.vp , duration)
    t.easing(TWEEN.Easing.Exponential.Out)   
    // t.onUpdate( () => {
    // controls.object.focus = controls.object.position.distanceTo(isSun() ? {z: 0} : el.mesh.position)
    // })

    if(changeFocus){
        const mesh = el.mesh || el
        t.onStart(() => {
            let focus = new TWEEN.Tween(controls.target)
            .to(mesh.position || {x:0, y:0, z:0}, duration)
            .easing(TWEEN.Easing.Exponential.Out)
            // focus.dynamic = true

            focus.start()
        })
    }

    t.dynamic = true
    return t
}
}
