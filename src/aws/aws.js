import aws from 'aws-sdk'

aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

export const uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        const s3 = new aws.S3({ apiVersion: '2006-03-01' });

        const uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "abc/" + file.originalname,
            Body: file.buffer
        }


        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            console.log("file uploaded succesfully")
            return resolve(data.Location)
        })

    })
}

// router.post("/write-file-aws", async function (req, res) {

//     try {
//         let files = req.files
//         if (files && files.length > 0) {
//             let uploadedFileURL = await uploadFile(files[0])
//             res.status(201).send({ msg: "file uploaded succesfully", data: uploadedFileURL })
//         }
//         else {
//             res.status(400).send({ msg: "No file found" })
//         }

//     }
//     catch (err) {
//         console.log(err);
//         res.status(500).send({ msg: err.message })
//     }

// })
