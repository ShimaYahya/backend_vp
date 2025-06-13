const projectTransformer = (project) => {
    project.photo = `${process.env.URL + process.env.UPLOADS + project.photo}`
    return project
}
const projectsTransformer = (ArrayOfprojects) => {
    return ArrayOfprojects.map((singleproject) => projectTransformer(singleproject))
}
module.exports = {
    projectTransformer,
    projectsTransformer
}