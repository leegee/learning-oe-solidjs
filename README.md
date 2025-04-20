# Quiz Lessons: learn Old English or anything

Configurable quiz cards for language learning or other quizes

## Features

* Purely client-side
* A SolidJS prototype without any third-party dependencies
* Several types of quiz lessons:
    1. multiple choice
    1. fill in the blanks
    1. match vocabulary
    1. translate a sentence
    1.  create a sentance from a list of words
* Easy to create card-based quiz lessons - WYSIWYG editor, [JSON](lessons.json) format with [JSON Scheme](./lessons.schema.json)
* Easy to create localisation and configuration in [JSON](app.config.json)
* Easy dev and builds with Vite and Typescript

![Multiple Choice](./README/multiple-choice.png)
![Pair words](./README/pair-words.png)
![Fill in the blanks](./README/blanks.png)
![write](./README/writing.png)

## Demo: Learn Old English

[https://leegee.github.io/learning-oe-solidjs/](https://leegee.github.io/learning-oe-solidjs/)

## Card types

* *Multiple choice* 
* *Vocab" presents two columns of shuffled words which need to be paired.
* *Blanks* presents a sentence with blanks which need to be completed from a list of words
* *Writing Blocks* rqeuires the user to translate a sentence by selecting words
* *Writing* rqeuires the user to translate a sentence by entering free text
* *Dynamic Vocab* selects creates a Vocab lesson by combining data from other cards in he lesson

## NB

Any resemblance to other language learning apps is purely coincidence. 

## TODO

Save & Load custom lessons

## Thanks:

* The [Junicode](https://github.com/psb1558/Junicode-font/releases/tag/v2.211) font.

Notes: 

`courseStore = createResource<ICourseStore>(useCourseStore, { initialValue: staticCourseStore });`
