import { PaymentBannerWrapper } from '@/components/PaymentUI'
import css from '@/components/css/convertToJs'
import starGradient from '@/public/star-fill-gradient.svg'
import Image from 'next/image'
import Link from 'next/link'

export default function PaymentBanner({ parameter }) {
	return (
		<PaymentBannerWrapper>
			<Link href={!parameter ? '/?abonnement=oui' : '/'}>
				<Image
					title="Souscrire"
					src={starGradient}
					alt="Une étoile dégradée de bleu"
					style={css`
						width: 1.6rem;
						height: auto;
					`}
				/>
			</Link>
		</PaymentBannerWrapper>
	)
}
