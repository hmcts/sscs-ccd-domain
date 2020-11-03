# SSCS CCD Definitions

# Local Development

To build a local version of the CCD Importer image:

    cd benefit
    docker build -t hmctspublic.azurecr.io/sscs/ccd-definition-importer-benefit:dev -f ../docker/importer.Dockerfile .
    
To generate a local AAT version of CCD def

    cd ../
    ./bin/create-xlsx.sh benefit dev aat

To generate a local PROD version of CCD def

    ./bin/create-xlsx.sh benefit dev prod

To generate a local version of CCD def similar to prod

    ./bin/create-xlsx.sh benefit dev local prod

You can then test loading this generated CCD def into your local environment version from sscs-docker project: Note:- local environment should have Python 3.0 or above version

    ./bin/ccd-import-definition.sh <your local directory path>/sscs-ccd-definitions/releases/CCD_SSCSDefinition_vdev_AAT.xlsx
    
# Pushing changes
    
* Raise a PR with the changes
* Open benefit/VERSION.yaml and modify the version number. This file will be used by the Azure Pipeline to create a docker importer image tagged with the specified version number.
* Update the benefit/data/sheets/CaseType.json and replace the right version for the field "Name": "SSCS Case v5.2.02_${CCD_DEF_E}"
* Get it approved and merged
* Pull latest master branch

Then, tag the master branch. Find the latest tag and bump by one. This tag does not relate to the version of either the benefit or bulkscan definitions. It is only the version
of this repository and does have any effect outside of that.
    
This little trick that will figure it out and tag automatically:

    git tag $(git describe --tags --abbrev=0 | awk -F. '{OFS="."}; {$NF+=1; print $0}')
    git push --tags
    
Run this command to manually bump the version number
NOTE: PLEASE DO NOT TRY TO KEEP THE CCD VERSION NUMBER AND THE TAGGED VERSION NUMBER IN SYNC AS IT CREATES CONFUSION AS THEY FREQUENTLY GET OUT OF SYNC

    git tag 1.0.18
    git push --tags
    
When a new tag is pushed, it will trigger an Azure Pipeline which will build the new benefit definition importer image and store it in the Azure Container Registry (ACR). In this case, the image will be called

    hmctspublic.azurecr.io/sscs/ccd-definition-importer-benefit:5.2.02
    
To create the AAT and PROD versions, move to the root of this repository, then run:

./bin/create-xlsx.sh benefit 5.2.02 aat
./bin/create-xlsx.sh benefit 5.2.02 prod

Put a message on the sscs-ccd slack channel with the new version

## Load a CCD definition to your local environment

Once version 5.2.02 appears in the ACR, you can run the following command to upload it to your local CCD Docker environment.

    ../bin/upload-ccd-definition-to-env.sh benefit 5.2.02 local
    
## Excel

If you prefer to work in Excel (usually for bigger changes), then create an Excel version

Move to the root of this repository. Find the latest version by looking at the VERSION.YAML file, then run:

    ./bin/create-xlsx.sh benefit 5.2.02 aat

The definition XLSXs will be created in the ./releases directory. (Takes a few seconds)

Make your changes to the relevant files

## Converting an XLSX definition to JSON

There are two SSCS CCD definition case types, benefit and bulkscan. Move into the directory of the one you need, e.g.

    cd benefit

    ../bin/xlsx2json.sh ~/Downloads/CCD_SSCSDefinition_v5.1.21_AAT.xlsx

Due to differences in the FixedLists tab between AAT and PROD, some FixedList rows are stored in the two files:

    FixedLists_AssignTo_AAT.txt
    FixedLists_AssignTo_PROD.txt

These should be updated as required. The conversion process performed by xlsx2json will have removed all the FL_AssignTo rows from the FixedLists.json file
and replace them with a template variable. It will have done a similar thing for all the callback URLs.

#Features

##Variable substitution

A json2xlsx processor is able to replace variable placeholders defined in JSON definition files with values read from environment variables as long as variable name starts with CCD_DEF prefix.

For example CCD_DEF_BASE_URL=http://localhost environment variable gets injected into fragment of following CCD definition:

[
  {
    "LiveFrom": "2017-01-01",
    "CaseTypeID": "Benefit",
    "ID": "createCase",
    "CallBackURLSubmittedEvent": "${CCD_DEF_BASE_URL}/callback"
  }
]
to become:

[
  {
    "LiveFrom": "2017-01-01",
    "CaseTypeID": "Benefit",
    "ID": "createCase",
    "CallBackURLSubmittedEvent": "http://localhost/callback"
  }
]

##JSON fragments

A json2xlsx processor is able to read smaller JSON fragments with CCD definitions that helps splitting large definition files into smaller chunks. These fragments can be read from any level of nested directory as long as the top level directory corresponds to a valid sheet name.

For example large AuthorisationCaseField.json file presented below:

[
  {
    "LiveFrom": "01/01/2017",
    "CaseTypeID": "Benefit",
    "CaseFieldID": "appeal",
    "UserRole": "caseworker-sscs-clerk",
    "CRUD": "CRU"
  },
  {
    "LiveFrom": "01/01/2017",
    "CaseTypeID": "Benefit",
    "CaseFieldID": "appeal",
    "UserRole": "caseworker-sscs-judge",
    "CRUD": "CRU"
  }
]
can be split into clerk.json file presented below:

[
  {
    "LiveFrom": "01/01/2017",
    "CaseTypeID": "DRAFT",
    "CaseFieldID": "appeal",
    "UserRole": "caseworker-sscs-clerk",
    "CRUD": "CRU"
  }
]
and judge.json file presented below:

[
  {
    "LiveFrom": "01/01/2017",
    "CaseTypeID": "DRAFT",
    "CaseFieldID": "appeal",
    "UserRole": "caseworker-sscs-judge",
    "CRUD": "CRU"
  }
]
located in AuthorisationCaseField directory that corresponds the XLS tab name.
