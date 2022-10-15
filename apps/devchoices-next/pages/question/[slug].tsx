import { useRouter } from 'next/router'
import { questions } from '../../public/assets/data/questions'
import { useEffect, useState } from 'react'
import { QuestionInterface } from '@benjamincode/shared/interfaces'
import { Button, Question } from '@benjamincode/shared/ui'

export async function getStaticProps(context): Promise<{ props: QuestionPageProps }> {
  const slug = context.params.slug
  // Get external data from the file system, API, DB, etc.
  const question = questions.find((q) => q.slug === slug)

  // The value of the `props` key will be
  //  passed to the `Home` component
  return {
    props: {
      question,
    },
  }
}

export async function getStaticPaths(context) {
  return {
    paths: questions.map((q) => ({ params: { slug: q.slug } })),
    fallback: false,
  }
}

export interface QuestionPageProps {
  question?: QuestionInterface
}

export function QuestionPage(props: QuestionPageProps) {
  const router = useRouter()
  const { slug } = router.query
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    setShowResult(false)
  }, [slug])

  const onNext = async () => {
    const currentQuestion = questions.find((q) => q.slug === slug)
    console.log(currentQuestion)

    await router.push({
      pathname: '/question/' + questions[questions.indexOf(currentQuestion) + 1].slug,
      query: { slug: questions[questions.indexOf(currentQuestion) + 1].slug },
    })
  }

  const onSkip = async () => {
    await router.push('/question/' + questions[questions.indexOf(props.question) + 1].slug)
  }

  const onLeft = () => {
    // todo store the +1 in the database

    setShowResult(true)
  }

  const onRight = () => {
    // todo store the +1 in the database

    setShowResult(true)
  }

  return (
    <div className="">
      <Question
        leftChoiceProps={{
          showResult: showResult,
          voteCount: 40,
          imgUrl: props.question?.choiceLeft.img_path,
          position: 'left',
          title: props.question?.choiceLeft.title,
          onClick: onLeft,
          totalCount: 200,
        }}
        rightChoiceProps={{
          showResult: showResult,
          voteCount: 160,
          imgUrl: props.question?.choiceRight.img_path,
          position: 'right',
          title: props.question?.choiceRight.title,
          onClick: onRight,
          totalCount: 200,
        }}
        showResult={showResult}
        onNext={onNext}
        onSkip={onSkip}
        onLeft={onLeft}
        onRight={onRight}
      />
    </div>
  )
}

export default QuestionPage